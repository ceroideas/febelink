import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CryptoCurrency } from 'src/app/models/currency.model';
import { ApiService } from '../api.service';

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

  async getBalanceByUserId() {
    return await this.api._getData(`wallet/balance`);
  }

  async exchange( assetOrigin: CryptoCurrency, assetDestiny: CryptoCurrency ) {
    const formData = new FormData();
    
    // Selling
    formData.append('selling', assetOrigin.currency );
    formData.append('amountSell', assetOrigin.amount + '' );

    // Buying
    formData.append('buying', assetDestiny.currency );
    formData.append('amountBuy', assetDestiny.amount + '' );
    
    return ( await this.api._createData( 'wallet/exchange', formData )).toPromise();
  }
}
