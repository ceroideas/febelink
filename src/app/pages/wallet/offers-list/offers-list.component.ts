import { Component, Input, OnInit } from '@angular/core';
import { CryptoCurrency, CryptoCurrencyType } from 'src/app/models/wallet/currency.model';
import { OffersFilter, OffersList, OffersType } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { OfferService } from 'src/app/services/wallet/offer.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
})
export class OffersListComponent implements OnInit {
  
  @Input() walletParams: WalletParams;

  offersList: OffersList[] = [
    { type: OffersType.MARKET, offers: [], lastIdsPerPage: [], isLoading: true },
    { type: OffersType.OWN, offers: [], lastIdsPerPage: [], isLoading: true }
  ]
  
  // Segmentation | Tab | Page displaying
  segment: OffersType = OffersType.MARKET;
  offersType = OffersType;

  // Sort Options
  orderAsc: boolean = false;
  assetSelling: CryptoCurrency;
  assetBuying: CryptoCurrency;
  currencyType = CryptoCurrencyType;

  constructor(
      private offerSvc: OfferService
    , private assetSvc: AssetService
  ) {}

  ngOnInit()
  {
    this.segmentChanged();
  }

  async segmentChanged( hasChanged: boolean = false )
  {
    const list = this.getList();

    if( hasChanged || !list?.offers || list?.offers?.length == 0 )
      this.refresh( list );
  }

  async selectAsset( event, isAssetSelling: boolean )
  {
    const asset = await this.assetSvc.select( event, this.walletParams.userWallets );
    if( !asset )
      return

      /* Asset Selling */
    if( isAssetSelling ) {
      this.assetSelling = asset;

      if( this.assetSelling?.currency == this.assetBuying?.currency )
        this.assetBuying == null;
        console.log( 'this.assetSelling?.currency == this.assetBuying?.currency ', this.assetSelling?.currency == this.assetBuying?.currency );
    }

    /* Asset Buying */
    if( !isAssetSelling ) {
      this.assetBuying = asset;

      if( this.assetBuying?.currency == this.assetSelling?.currency )
        this.assetSelling == null;
    }
    
    console.log( 'assetBuying: ', this.assetBuying, ' || assetSelling: ', this.assetSelling );
    this.refresh();
  }

  order()
  {
    this.orderAsc = !this.orderAsc;
    this.refresh();
  }

  async refresh( list?: OffersList )
  {
    if( !list )
      list = this.getList();
    
    list.isLoading = true;
    const response = await this.offerSvc.list({
        last_item: list?.lastIdsPerPage?.length > 0 ?
          list.lastIdsPerPage[ list?.lastIdsPerPage?.length -1 ] : null,

        selling: this.assetSelling?.assetId,

        buying: this.assetBuying?.assetId,

        public: list.type != OffersType.OWN ? null : this.walletParams.publicKey,
        
        order: this.orderAsc ? 'asc' : 'desc'
      } as OffersFilter,
    );
    list.offers = response.offers
    console.log( 'response: ', list.offers );
    list.isLoading = false;
  }

  paginToken( list: OffersList )
  {
    if( list?.offers?.length > 0 ) {
      const lastId = list[ list?.offers?.length -1 ]?.paging_token;
      list.lastIdsPerPage.push( lastId );
      return lastId;
    }

    return null;
  }

  getList()
  {
    for( let i = 0; i < this.offersList?.length; i++ )
      if( this.offersList[ i ].type == this.segment )
        return this.offersList[ i ];
        
    return null;
  }
}
