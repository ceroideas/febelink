import { Injectable } from '@angular/core';
import { CryptoCurrency } from '../../models/wallet/currency.model';
import { Offer, OffersFilter } from '../../models/wallet/offers.models';
import { HttpService, IHttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class OfferService {

  constructor(
      private http: HttpService
  ) {}

  async sell( offer: Offer ): Promise<IHttpService>
  {
    return this.http.post( 'wallet/offers/sell', this.offerToParam( offer ))
  }

  async buy( offer: Offer ): Promise<IHttpService>
  {
    return this.http.post( 'wallet/offers/buy', this.offerToParam( offer ))
  }

  async update( offer: Offer ): Promise<IHttpService>
  {
    return this.http.put( 'wallet/offers/' + offer?.id, this.offerToParam( offer ))
  }

  async delete( offer: Offer ): Promise<IHttpService>
  {
    return this.http.delete( 'wallet/offers/' + offer?.id, this.offerToParam( offer ))
  }

  async list( filter: OffersFilter ): Promise<IHttpService>
  {
    return this.http.get( 'wallet/offers/list', filter )
  }

  async marketPrice( sell: CryptoCurrency, buy: CryptoCurrency ): Promise<IHttpService>
  {
    return this.http.get( 'wallet/offers/marketPrice', this.sellNbuyToParm( sell, buy ))
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
    
    return offers;
  }

  private sellNbuyToParm( sell: CryptoCurrency, buy: CryptoCurrency ): Object {
    return {
      selling: sell.assetId,
      sellingIssuerId: sell.issuerId,

      buying: buy.assetId,
      buyingIssuerId: buy.issuerId
    }
  }
}
