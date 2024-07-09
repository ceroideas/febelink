import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { IUser } from '../../models/user.model';
import { CryptoCurrency } from '../../models/wallet/currency.model';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(
    private api: ApiService
  ) {}

  async getWalletInfo() {
    return await this.api._getData( `wallet/getWalletInfo` );
  }

  async getBalanceByUserId( id?: string | number ) {
    return await this.api._getData( 'wallet/balance' + ( id ? '/' + id : ''));
  }

  async exchange( assetOrigin: CryptoCurrency, assetDestiny: CryptoCurrency ) {
    const formData = new FormData();
    
    // Selling
    formData.append('selling', assetOrigin.currency ?? ''); // Use nullish coalescing operator to provide a default value ('' in this case) if assetOrigin.currency is undefined
    formData.append('amountSell', assetOrigin.amount + '' );

    // Buying
    formData.append('buying', assetDestiny.currency ?? ''); 
    formData.append('amountBuy', assetDestiny.amount + '' );
    
    return ( await this.api._createData( 'wallet/exchange', formData )).toPromise();
  }

  async send(
    publicKey: string,
    currency: string,
    amount: number,
    returnBalance: boolean = true,
    user: IUser
  ) {
    const formData = new FormData();

      formData.append( 'destinationPublicKey', publicKey )
      formData.append( 'asset', currency )
      formData.append( 'amount', ( amount || '' ) + '' )
      formData.append( 'returnBalance', returnBalance ? '1' : '0' )
      formData.append('user', user ? JSON.stringify(user) : '');

      await this.api.utilities.showLoading()
      const response = ( await this.api._createData('wallet/payments/send', formData)).toPromise()

      return response
  }
}
