import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';
import { LandingService } from '../../services/landing.service';
import { UserDataFormComponent } from '../user-data-form/user-data-form.component';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-buy-tokens',
  templateUrl: './buy-tokens.component.html',
  styleUrls: ['./buy-tokens.component.scss'],
})
export class BuyTokensComponent implements OnInit {
  
  constructor(
    private router: Router
    , private utils:UtilitiesService
    , private modalController: ModalController
    , private landingSvc:LandingService
    , private api:ApiService
    , private translateService: TranslateConfigService
  ) { }
    
  numTokens:number;
  numFiat:number;
  phaseToTokenCost:[];

  async ngOnInit() {
    this.phaseToTokenCost = await (await this.api._getData('getPhaseToTokenCost')).toPromise();
  }

  async justLogged(){
    // debugger;
    if(!this.landingSvc.isJustLogged()) return;
    const profile = await this.utils.getUserData()
    if(!profile) return;
    this.buyTokens(profile)
  }

  async buyTokens(profile?: any){
    
    const numFiat = this.numFiat || this.landingSvc.getNumFiat();
    if(!numFiat) {
      this.utils.showToast("Indica cuantos tokens quieres comprar");  
      return
    }
    const phaseTokens = this.landingSvc.getPhaseTokens();
    if(!phaseTokens) {
      this.utils.showToast("Indica en qué fase quieres comprar los tokens");  
      return
    }
    if(!profile) profile = await this.utils.getUserData()

    if(profile?.id) {
      const userData:UserLanding = {
        name: profile.name,
        lastName: profile.lastName,
        email: profile.email,
        dni: profile.dni,
        link_url: profile.link_url,
        phone: profile.telefono,
        id: profile.id,

        address: profile.direccion,
        address_rest: profile.direccion_resto,
        country: profile.country,
        state: profile.state,
        department: profile.department,
        locality: profile.locality,
        place_id: profile.place_id
      }
  
      const modal = await this.modalController.create({
        component: UserDataFormComponent,
        componentProps: {userData},
        cssClass: 'landing-modal'
      });

      this.landingSvc.setJustLogged(false);
      modal.onDidDismiss().then(async response => {
        if(!response.data){
          return;
        }
        const userLanding:UserLanding = response.data.userCompleteData;
        // console.log(userLanding);
        this.landingSvc.setUser(userLanding);
        const lang = ILangDEFAULTS.getCurrentLang( this.translateService ).lang;

        const formData = new FormData();
        formData.append('name', userLanding.name);
        formData.append('lastName', userLanding.lastName);
        formData.append('email', userLanding.email);
        formData.append('dni', userLanding.dni);
        
        formData.append('direccion', userLanding.address);
        formData.append('direccion_resto', userLanding.address_rest);
        formData.append('country', userLanding.country);
        formData.append('state', userLanding.state);
        formData.append('department', userLanding.department);
        formData.append('locality', userLanding.locality);
        formData.append('place_id', userLanding.place_id);

        formData.append('telefono', userLanding.phone);
        formData.append('tokens_cost_euros', numFiat.toString());
        formData.append('phase_tokens', phaseTokens.toString());
        formData.append('lang', lang);

        
        try {
          const responseObs:Observable<any> = await this.api._createData('addUserToken', formData);
          const res = await responseObs.pipe(first()).toPromise();

          this.saveInSession(profile, userLanding);
          // console.log(res);
          
          if(!res.success){
            let errorMsg = res.message;
            const errorMsgBase = '\n - ';
            if(res.nombre === false) errorMsg += errorMsgBase+'Nombre'
            if(res.lastName === false) errorMsg += errorMsgBase+'Apellido'
            if(res.email === false) errorMsg += errorMsgBase+'Email'
            if(res.dni === false) errorMsg += errorMsgBase+'DNI'
            if(res.phone === false) errorMsg += errorMsgBase+'Teléfono'
            alert(errorMsg);
          } else {
            window.location.href = res.externalCheckoutUrl;
          }

        } catch(ex) {
          alert("Error al comprar los tokens. Por favor, contacte con info@febelink.com");
          console.error(ex);
        }

      });
      modal.present();
    } else{
      this.landingSvc.setJustLogged(true);
      this.landingSvc.setNumFiat(numFiat);
      this.router.navigate(['login', 'token'])
    }
  }

  lastInput:LastInput;
  private saveInSession(profile: any, userLanding: UserLanding) {
    profile.name = userLanding.name;
    profile.lastName = userLanding.lastName;
    profile.dni = userLanding.dni;
    profile.telefono = userLanding.phone;
    
    profile.direccion = userLanding.address;
    profile.direccion_resto = userLanding.address_rest;
    profile.country = userLanding.country;
    profile.state = userLanding.state;
    profile.department = userLanding.department;
    profile.locality = userLanding.locality;
    profile.place_id = userLanding.place_id;

    this.utils.saveUserData(profile);
  }

  phaseChange(event){
    this.landingSvc.setPhaseTokens(+event.detail.value)
    if(this.lastInput === LastInput.Fiat){
      this.fiatToTokens({target:{value: this.numFiat}});
    } 
    // else if(this.lastInput === LastInput.Token){
    //   this.tokensToFiat({target:{value: this.numTokens}});
    // }
  }

  // tokensToFiat(event){
  //   console.log("tokensToFiat");    
  //   let tokens = event.target.value;
  //   tokens = Math.round(tokens * 100) / 100
  //   this.numTokens = tokens;
  //   this.numFiat = Math.round(tokens * this.tokenCost() * 100) / 100;
  //   this.lastInput = LastInput.Token;
  // }

  fiatToTokens(event){   
    let fiat = event.target.value;
    fiat = Math.round(fiat * 100) / 100
    this.numFiat = fiat;
    this.numTokens = Math.trunc(fiat / this.tokenCost() * 100) / 100;
    this.lastInput = LastInput.Fiat;
  }

  tokenCost():number{
    const phaseTokens = this.landingSvc.getPhaseTokens();
    if(!phaseTokens) return 0;
    return this.phaseToTokenCost[phaseTokens];
  }
}

enum LastInput {
  Token = 1,
  Fiat = 2
}
