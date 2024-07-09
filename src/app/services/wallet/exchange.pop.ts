import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CryptoCurrency } from '../../models/wallet/currency.model';
import { ExchangeType } from '../../models/wallet/exchange.model';
import { Offer } from '../../models/wallet/offers.models';
import { WalletParams } from '../../models/wallet/params.model';
import { ExchangeComponent } from '../../pages/wallet/exchange/exchange.component';

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

                OnDismiss: (data:any) => exchangeModal.dismiss( data )
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
