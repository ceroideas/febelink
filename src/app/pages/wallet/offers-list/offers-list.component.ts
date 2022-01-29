import { Component, Input, OnInit } from '@angular/core';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { Asset, Offer } from 'src/app/models/wallet/offers.models';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { OfferService } from 'src/app/services/wallet/offer.service';

export enum OffersType {
  MARKET = "market",
  OWN = "own"
}

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
})
export class OffersListComponent implements OnInit {

  @Input() offersMarket: Offer[];
  @Input() offersOwn: Offer[];
  @Input() type: OffersType = OffersType.MARKET;
  offersType = OffersType;
  
  // Assets Available for the user to use
  @Input() assetTypes: CryptoCurrency[] = [];


  // This array is to store the last id per page to go back on prev_page (pagination)
  lastIdsPerPage: string[];

  orderAsc: boolean = true;
  assetSelling: CryptoCurrency;
  assetBuying: CryptoCurrency;

  // Segmentation | Tab | Page displaying
  segment: string;
  

  constructor(
      private offerSvc: OfferService
    , private assetSvc: AssetService
  ) {}

  ngOnInit() {}

  async selectAsset( isOwn: boolean ) {
    const asset = await this.assetSvc.select( this.assetTypes );

  }

  async refresh( offers: Offer[] ) {
    const list = await this.offerSvc.list({
        buying: {
          asset_code: this.assetBuying?.assetId
        } as Asset,

        selling: {
          asset_code: this.assetSelling?.assetId
        } as Asset,
        paging_token: this.paginToken( offers )
      } as Offer
    );
  }

  paginToken( list: Offer[] ) {
    if( list.length > 0 ) {
      const lastId = list[ list.length -1 ]?.paging_token;
      this.lastIdsPerPage.push( lastId );
      return lastId;
    }

    return null;
  }
}
