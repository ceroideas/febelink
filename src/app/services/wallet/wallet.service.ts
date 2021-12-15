import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(
    private api: ApiService
  ) {}

  async getPublicKey() {
    return await this.api._getData( `wallet/getPublicKey` );
  }

  async getBalanceByUserId(userId: string) {
    return await this.api._getData(`wallet/balance/${userId}`);
  }
}
