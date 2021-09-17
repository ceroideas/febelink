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
        email: profile.email,
        address: profile.direccion,
        dni: profile.dni,
        phone: profile.telefono,
        id: profile.id
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
        formData.append('email', userLanding.email);
        formData.append('dni', userLanding.dni);
        formData.append('address', userLanding.address);
        formData.append('phone', userLanding.phone);
        formData.append('num_tokens', numTokens.toString());

        try {
          const responseObs:Observable<any> = await this.api._createData('addUserToken', formData);
          await responseObs.pipe(first()).toPromise();
          // console.log(this.addUserTokenResponse);        
        } catch(ex) {
          alert("Error al comprar los tokens. Por favor, contacte con info@febelink.com");
          console.error(ex);          
        }

        this.router.navigate(['token', 'checkout'])
      });
      modal.present();
    } else{
      this.landingSvc.setJustLogged(true);
      this.landingSvc.setNumTokens(numTokens);
      this.router.navigate(['login', 'token'])
    }
  }

}
