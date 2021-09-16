import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
      modal.onDidDismiss().then(response => {
        if(!response.data){
          return;
        }
        console.log(response.data.userCompleteData);
        this.landingSvc.setUser(response.data.userCompleteData);

        this.router.navigate(['token', 'checkout'])
      });
      modal.present();
    } else{
      this.landingSvc.setJustLogged(true);
      this.router.navigate(['login', 'token'])
    }
  }

}
