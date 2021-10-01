import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';
import { LandingService } from '../../services/landing.service';
import { UserDataFormComponent } from '../user-data-form/user-data-form.component';
import { CookieService } from "ngx-cookie-service";

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
    , private cookSvc: CookieService
  ) { }
    
  numTokens:number;
  numFiat:number;
  phaseToTokenCost:[];
  langSelected: ILang;

  async ngOnInit() {
    this.phaseToTokenCost = await (await this.api._getData('getPhaseToTokenCost')).toPromise();
    
    this.langSelected = this.langSelected ? this.langSelected :
        ILangDEFAULTS.getLangDEFAULT( this.cookSvc );
  }

  async justLogged(){
    // debugger;
    if(!this.landingSvc.isJustLogged()) return;
    const profile = await this.utils.getUserData()
    if(!profile) return;
    this.buyTokens(profile)
  }

  async buyTokens(profile?: any){
    
    const numTokens = this.numTokens || this.landingSvc.getNumTokens();
    if(!numTokens) {
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
        address: profile.direccion,
        dni: profile.dni,
        phone: profile.telefono,
        id: profile.id,
        province_id: profile.province_id,
        town_id: profile.town_id
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

        const formData = new FormData();
        formData.append('name', userLanding.name);
        formData.append('lastName', userLanding.lastName);
        formData.append('email', userLanding.email);
        formData.append('dni', userLanding.dni);
        formData.append('province_id', userLanding.province_id.toString());
        formData.append('town_id', userLanding.town_id.toString());
        formData.append('direccion', userLanding.address);
        formData.append('telefono', userLanding.phone);
        formData.append('num_tokens', numTokens.toString());
        formData.append('phase_tokens', phaseTokens.toString());
        formData.append('lang', this.langSelected.lang);

        
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
      this.landingSvc.setNumTokens(numTokens);
      this.router.navigate(['login', 'token'])
    }
  }

  lastInput:LastInput;
  private saveInSession(profile: any, userLanding: UserLanding) {
    profile.name = userLanding.name;
    profile.lastName = userLanding.lastName;
    profile.direccion = userLanding.address;
    profile.dni = userLanding.dni;
    profile.telefono = userLanding.phone;
    profile.province_id = userLanding.province_id;
    profile.town_id = userLanding.town_id;
    this.utils.saveUserData(profile);
  }

  phaseChange(event){
    this.landingSvc.setPhaseTokens(+event.detail.value)
    if(this.lastInput === LastInput.Fiat){
      this.fiatToTokens({target:{value: this.numFiat}});
    } else if(this.lastInput === LastInput.Token){
      this.tokensToFiat({target:{value: this.numTokens}});
    }
  }

  tokensToFiat(event){
    this.numFiat = Math.round(event.target.value * this.tokenCost() * 100) / 100;
    this.lastInput = LastInput.Token;
  }

  fiatToTokens(event){
    this.numTokens = Math.trunc(event.target.value / this.tokenCost());
    this.lastInput = LastInput.Fiat;
  }

  tokenCost():number{
    const phaseTokens = this.landingSvc.getPhaseTokens();
    if(!phaseTokens) return 0;
    return this.phaseToTokenCost[phaseTokens];
  }

  setLang( lang: ILang ): BuyTokensComponent {
    this.langSelected = lang;
    return this;
  }
}

enum LastInput {
  Token = 1,
  Fiat = 2
}
