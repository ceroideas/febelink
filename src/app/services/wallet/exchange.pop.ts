import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { ExchangeType } from 'src/app/models/wallet/exchange.model';
import { Offer } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { ExchangeComponent } from 'src/app/pages/wallet/exchange/exchange.component';

@Injectable({
  providedIn: 'root',
})
export class ExchangePop {

    constructor(
        private popCtrl: PopoverController
    ) {}

    async show( exchangeType: ExchangeType, walletParams: WalletParams,
        params: { offer?: Offer, sell?: CryptoCurrency, buy?: CryptoCurrency }
    ): Promise<any> {
        const exchangeModal = await this.popCtrl.create({
            component: ExchangeComponent,
            componentProps:{
                offer: params?.offer,
                sell: params?.sell,
                buy: params?.buy,

                walletParams: walletParams,
                exchangeType: exchangeType,

                OnDismiss: data => exchangeModal.dismiss( data )
            },
            cssClass: 'pop-w-700 pop-op-5 pop-br-5',
        });
        await exchangeModal.present();
        
        const { data } = await exchangeModal.onDidDismiss();
        
        return new Promise( resolve => { resolve({
              saved: data?.saved
            , response: data?.response
            , error: data?.error
        })});
    }
}
