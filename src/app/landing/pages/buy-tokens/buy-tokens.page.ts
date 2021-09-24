import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { LandingService } from '../../services/landing.service';
import { BuyTokensComponent } from '../../shared/buy-tokens/buy-tokens.component';

@Component({
  selector: 'app-page-buy-tokens',
  templateUrl: './buy-tokens.page.html',
  styleUrls: ['./buy-tokens.page.scss'],
})
export class BuyTokensPage {

  constructor(
    private router: Router
    , private utils:UtilitiesService
    , private modalController: ModalController
    , private landingSvc:LandingService
    , private api:ApiService
  ) { }


  ionViewDidEnter(){
    (new BuyTokensComponent(this.router,this.utils,this.modalController, this.landingSvc, this.api)).justLogged();
  }
}
