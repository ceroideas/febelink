import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Offer } from 'src/app/models/wallet/offers.models';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { OfferService } from 'src/app/services/wallet/offer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {

  @Input() offer: Offer;
  @Input() isSelling: boolean;

  constructor(
      private modalController: ModalController
    , private popCtrl: PopoverController
    , private translateSvc: TranslateConfigService
    , private utilities: UtilitiesService
    , private offerSvc: OfferService
    , public assetSvc: AssetService
  ) {}

  ngOnInit() {}
  
  buy() {
    this.offerSvc.buy( this.offer );
  }

  edit() {

  }

  delete() {

  }
}
