import { CryptoTransactions } from './../../models/wallet/currency.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { LoadingSvc } from '../loading.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletInfoSvc
{
  walletParams: WalletParams = { userWallets: [] }
  transactions: CryptoTransactions
  isLoading: boolean = false
  
  constructor(
    private walletSvc: WalletService,
    private loadingSvc: LoadingSvc,
  ) {}

  get( showLoading: boolean = true ): Promise<WalletParams>
  {
    return new Promise<WalletParams>( async resolve =>
    {
      if( showLoading ) await this.loadingSvc.show()
      this.isLoading = true

      const serviceRequest: Observable<any> = await this.walletSvc
        .getWalletInfo()
        .then();
      serviceRequest.subscribe( async response => {
        this.setVars( response )

        if( showLoading ) await this.loadingSvc.dismiss()

        resolve( this.walletParams )
      })
    })
  }

  setVars(response) {
    this.walletParams.publicKey = response.publicKey;
    this.walletParams.userWallets = response.data;
    this.walletParams.retainedTks = response.retainedTks;
    this.walletParams.verified = response.verified;
    this.transactions = response.transacciones;
    this.walletParams.minnersFee = response.minnersFee;
    this.isLoading = false;
    this.walletParams.stripeFee = response.stripeFee;
    this.walletParams.assetsMaxDecimals = Number(
      response.assetsMaxDecimals || '0'
    );
  }
}
