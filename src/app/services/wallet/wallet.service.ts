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

  async getBalanceByUserId(userId: string) {
    return await this.api._getData(`wallet/balance/${userId}`);
  }

  async exchange( assetOrigin: CryptoCurrency, assetDestiny: CryptoCurrency ) {
    const formData = new FormData();
    formData.append('assetOrigin_currency', assetOrigin.currency );
    formData.append('assetOrigin_ammount', assetOrigin.ammount + '' );
    formData.append('assetDestiny_currency', assetDestiny.currency );
    formData.append('assetDestiny_ammount', assetOrigin.ammount + '' );
    return ( await this.api._createData( 'wallet/exchange', formData )).toPromise();
  }
}
