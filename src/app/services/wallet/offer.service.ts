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

  private offerToParam( offer: Offer ) {
      const offers = {
      selling: offer.selling.asset_code,
      sellingIssuerId: offer.selling.asset_issuer,
      sellingAmount: offer.price_r.d,

      buying: offer.buying.asset_code,
      buyingIssuerId: offer.buying.asset_issuer,
      buyingAmount: offer.price_r.n,

      amount: offer.amount,

      offerId: offer.id
    };
    
    console.log( 'offer: ', offers );
    return offers;
  }
}
