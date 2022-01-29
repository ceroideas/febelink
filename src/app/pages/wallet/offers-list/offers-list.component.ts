import { Component, Input, OnInit } from '@angular/core';
import { CryptoCurrency, CryptoCurrencyType } from 'src/app/models/wallet/currency.model';
import { OffersFilter, OffersList, OffersType } from 'src/app/models/wallet/offers.models';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { OfferService } from 'src/app/services/wallet/offer.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
})
export class OffersListComponent implements OnInit {
  
  // Assets Available for the user to use
  @Input() assetTypes: CryptoCurrency[] = [];

  // User Public Key
  @Input() public: string;

  offersList: OffersList[] = [
    { type: OffersType.MARKET, offers: [], lastIdsPerPage: [], isLoading: true },
    { type: OffersType.OWN, offers: [], lastIdsPerPage: [], isLoading: true }
  ]
  
  // Segmentation | Tab | Page displaying
  segment: OffersType = OffersType.MARKET;
  offersType = OffersType;

  // Sort Options
  orderAsc: boolean = false;
  assetSelling: CryptoCurrency = { currency: CryptoCurrencyType.aureo };
  assetBuying: CryptoCurrency;

  constructor(
      private offerSvc: OfferService
    , private assetSvc: AssetService
  ) {}

  ngOnInit()
  {
    this.segmentChanged();
  }

  async segmentChanged( event? )
  {
    const list = this.getList();

    if( !list?.offers || list?.offers?.length == 0 )
      this.refresh( list );
  }

  async selectAsset()
  {
    const asset = await this.assetSvc.select( this.assetTypes );
    if( !asset || asset == this.assetSelling )
      return

    this.assetSelling = asset;
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
    
      console.log( 'list: ', list );
    list.isLoading = true;
    list.offers = await this.offerSvc.list({
        last_item: list?.lastIdsPerPage?.length > 0 ?
          list.lastIdsPerPage[ list?.lastIdsPerPage?.length -1 ] : null,

        selling: this.assetSelling?.assetId,

        buying: this.assetBuying?.assetId,

        account: list.type != OffersType.OWN ? null : this.public
      } as OffersFilter,
    );
    console.log( 'answer: ', list.offers );
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
