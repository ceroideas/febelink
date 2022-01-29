import { Injectable } from '@angular/core';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { Offer } from 'src/app/models/wallet/offers.models';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class OfferService {

  constructor(
      private api: ApiService
  ) {}

  async getOffers() {
    return await this.api._getData( `wallet/offers` );
  }

  async sell( assetOrigin: CryptoCurrency, assetDestiny: CryptoCurrency ) {
    const formData = new FormData();
    
    // Selling
    formData.append('selling', assetOrigin.currency );
    formData.append('amountSell', assetOrigin.amount + '' );

    // Buying
    formData.append('buying', assetDestiny.currency );
    formData.append('amountBuy', assetDestiny.amount + '' );
    
    return ( await this.api._createData( 'wallet/sell', formData )).toPromise();
  }

  async buy( offer: Offer ) {
    const formData = new FormData();
    
    // Selling
    formData.append('selling', offer?.buying?.asset_code );
    formData.append('sellingIssuerId', offer?.buying?.asset_issuer );
    formData.append('amountSell', offer.amount + '' );

    // Buying
    formData.append('buying', offer?.selling?.asset_code );
    formData.append('sellingIssuerId', offer?.selling?.asset_issuer );
    formData.append('amountBuy', offer.amount + '' );
    
    return ( await this.api._createData( 'wallet/buy', formData )).toPromise();
  }

  async list( offer: Offer ) {
    const formData = new FormData();
    
    return ( await this.api._createData( 'wallet/list', formData )).toPromise();
  }
}
