import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
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
    console.log(numTokens);
    const navigationExtras: NavigationExtras = {
      state: {numTokens}
    };
    const profile = await this.utils.getUserData()

    const modal = await this.modalController.create({
      component: UserDataFormComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
    // if(profile.id) 

    // this.router.navigate(['token', 'checkout'], navigationExtras)
  }

}
