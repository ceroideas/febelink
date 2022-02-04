import { Injectable } from '@angular/core';
import { Offer, OffersFilter } from 'src/app/models/wallet/offers.models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class OfferService {

  constructor(
      private http: HttpService
  ) {}

  async sell( offer: Offer )
  {
    return ( await this.http.post( 'wallet/offers/sell', this.offerToParam( offer ))).toPromise();
  }

  async buy( offer: Offer )
  {
    return ( await this.http.post( 'wallet/offers/buy', this.offerToParam( offer ))).toPromise();
  }

  async update( offer: Offer )
  {
    return ( await this.http.put( 'wallet/offers/' + offer?.id, this.offerToParam( offer ))).toPromise();
  }

  async delete( offer: Offer )
  {
    return ( await this.http.delete( 'wallet/offers/' + offer?.id, this.offerToParam( offer ))).toPromise();
  }

  async list( filter: OffersFilter )
  {
    return ( await this.http.get( 'wallet/offers/list', filter )).toPromise();
  }

  calcBuy( amount: string | number, price: string | number, maxDecimals: number ): number {
    const nbr: number = Number.parseFloat(( amount || '1' ) + '' ) * Number.parseFloat(( price || '1' ) + '' );
    // To truncate without rounding || otherwise will not match sell with buy
    return Number.parseFloat( nbr.toString().slice(0, ( nbr.toString().indexOf( '.' )) + maxDecimals ));
  }

  private offerToParam( offer: Offer ) {
      const offers = {
      selling: offer.selling.asset_code,
      sellingIssuerId: offer.selling.asset_issuer,

      buying: offer.buying.asset_code,
      buyingIssuerId: offer.buying.asset_issuer,

      amount: offer.amount,

      price_selling: offer?.price_r?.d,
      price_buying: offer?.price_r?.n,

      offerId: offer.id
    };
    
    console.log( 'offer: ', offers );
    return offers;
  }
}
