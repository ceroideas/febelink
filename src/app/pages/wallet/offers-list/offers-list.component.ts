import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CryptoCurrency, CryptoCurrencyType } from 'src/app/models/wallet/currency.model';
import { ExchangeType } from 'src/app/models/wallet/exchange.model';
import { OffersFilter, OffersList, OffersType } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { ToastSvc } from 'src/app/services/toast.service';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { OfferService } from 'src/app/services/wallet/offer.service';

@Component({
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
})
export class OffersListComponent implements OnInit, OnChanges {
  
  @Input() walletParams: WalletParams;
  @Output() OnChange: EventEmitter<ExchangeType> = new EventEmitter()

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
    , public assetSvc: AssetService
    , public toastSvc: ToastSvc
  ) {}

  ngOnInit()
  {
    this.segmentChanged();
  }
  
  ngOnChanges( changes: SimpleChanges ) {
    // Set default asset selected == First item in list == ownAsset
    if( this.assetSelling == null && this.walletParams?.userWallets?.length > 0 )
      this.assetSelling = { currency: this.walletParams?.userWallets[ 0 ]?.currency };
  }

  async segmentChanged( hasChanged: boolean = false )
  {
    const list = this.getList();

    if( hasChanged || !list?.offers || list?.offers?.length == 0 )
      this.refresh( list );
  }

  async selectAsset( event, isSelling: boolean )
  {
    const asset = await this.assetSvc.select( event, this.walletParams.userWallets );
    if( !asset )
      return

      /* Asset Selling */
    if( isSelling ) {
      this.assetSelling = asset;

      if( this.assetSelling?.currency == this.assetBuying?.currency )
        delete this.assetBuying;
    }

    /* Asset Buying */
    if( !isSelling ) {
      this.assetBuying = asset;

      if( this.assetBuying?.currency == this.assetSelling?.currency )
        delete this.assetSelling;
    }
    
    this.refresh();
  }

  order()
  {
    this.orderAsc = !this.orderAsc;
    this.refresh();
  }

  async refresh( list?: OffersList )
  {
    // Inform Wallet that offers changed
    this.OnChange.emit();

    if( !list )
      list = this.getList();
    
    list.isLoading = true;
    const { response, error } = await this.offerSvc.list({
      last_item: list?.lastIdsPerPage?.length > 0 ?
        list.lastIdsPerPage[ list?.lastIdsPerPage?.length -1 ] : null,

      selling: this.assetSelling?.assetId,

      buying: this.assetBuying?.assetId,

      public: list.type != OffersType.OWN ? null : this.walletParams.publicKey,
      
      order: this.orderAsc ? 'asc' : 'desc'
    } as OffersFilter );

    if( error ) {
      this.toastSvc.show( error?.message || 'An error occurred when trying to get offers list' );
      return;
    }

    list.offers = response.offers
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
