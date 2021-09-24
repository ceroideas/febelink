import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';
import { LandingService } from '../../services/landing.service';
import { UserDataFormComponent } from '../user-data-form/user-data-form.component';

@Component({
  selector: 'app-buy-tokens',
  templateUrl: './buy-tokens.component.html',
  styleUrls: ['./buy-tokens.component.scss'],
})
export class BuyTokensComponent {
  
  constructor(
    private router: Router
    , private utils:UtilitiesService
    , private modalController: ModalController
    , private landingSvc:LandingService
    , private api:ApiService
  ) { }
    
  numTokens:number;

  async justLogged(){
    // debugger;
    if(!this.landingSvc.isJustLogged()) return;
    const profile = await this.utils.getUserData()
    if(!profile) return;
    this.buyTokens(profile)
  }

  async buyTokens(profile?: any){
    console.log(this.numTokens);

    const numTokens = this.numTokens || this.landingSvc.getNumTokens();
    if(!numTokens) {
      this.utils.showToast("Indica cuantos tokens quieres comprar");  
      return
    };
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
        console.log(userLanding);
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

        try {
          const responseObs:Observable<any> = await this.api._createData('addUserToken', formData);
          const res = await responseObs.pipe(first()).toPromise();
          console.log(res);
          
          if(!res.success){
            let errorMsg = 'Revisa los campos:';
            const errorMsgBase = '\n - ';
            if(!res.nombre) errorMsg += errorMsgBase+'Nombre'
            if(!res.lastName) errorMsg += errorMsgBase+'Apellido'
            if(!res.email) errorMsg += errorMsgBase+'Email'
            if(!res.dni) errorMsg += errorMsgBase+'DNI'
            if(!res.phone) errorMsg += errorMsgBase+'Teléfono'
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

}
