import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';
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
  ) { }

  async buyTokens(numTokensInput){
    const numTokens = numTokensInput.value
    
    const profile = await this.utils.getUserData()

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
      });
      return await modal.present();
    } else{
      this.router.navigate(['login'])
    }
    
    const navigationExtras: NavigationExtras = {
      state: {numTokens}
    };

    // this.router.navigate(['token', 'checkout'], navigationExtras)
  }

}
