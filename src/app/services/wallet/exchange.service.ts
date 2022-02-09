import { Injectable } from '@angular/core';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { ExchangeType } from 'src/app/models/wallet/exchange.model';
import { Asset, AssetTypes, Offer } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { LoadingSvc } from '../loading.service';
import { ToastSvc } from '../toast.service';
import { UserService } from '../user.service';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {

    exchangeType: ExchangeType;
    walletParams: WalletParams;

    constructor(
        protected userSvc: UserService
        , protected offerSvc: OfferService
        , protected loadingSvc: LoadingSvc
        , protected toastSvc: ToastSvc
    ) {}

    setParams( walletParams: WalletParams ) {
        this.walletParams = walletParams;
    }

    setType( exchangeType: ExchangeType ) {
        this.exchangeType = exchangeType;
    }

    protected async redir() {
        // If user has not verified Data and Email, redirect to profile
        if( !this.walletParams.verified.mandatory ) {
            await this.userSvc.showAlertToRedir();
            return true;
        }

        return false;
    }

    public async OnDone( data, offer: Offer ): Promise<any> {
        // Delete Offer
        if( data?.delete ) {
            const { response, error } = await this.do( ExchangeType.DELETE, offer );
            return new Promise( resolve => { resolve({ saved: true, response, error })});
        }

        if( data?.sell && data?.buy ) {
            const { response, error } = await this.do( this.exchangeType, offer, data?.sell, data?.buy );
            
            // Since the only way to get till here is if verified
            this.walletParams.verified.kyc = true;

            return new Promise( resolve => { resolve({ saved: true, response, error })});
        }

        return new Promise( resolve => { resolve({ saved: false })});
    }

    protected async do( exchangeType: ExchangeType, offer: Offer, sell?: CryptoCurrency, buy?: CryptoCurrency )
    {
        await this.loadingSvc.show();

        let answer: { response, error };
        switch( exchangeType ) {
            case ExchangeType.CREATE:
                answer = await this.offerSvc.sell( this.toOffer( sell, buy, offer ));
                break;
            case ExchangeType.EDIT:
                answer = await this.offerSvc.update( this.toOffer( sell, buy, offer ));
                break;
            case ExchangeType.BUY:
                answer = await this.offerSvc.buy( this.toOffer( sell, buy, offer ));
                break;
            case ExchangeType.DELETE:
                answer = await this.offerSvc.delete( offer );
                break;
        }

        if( answer?.error )
            console.log({ error: answer?.error });

        this.toastSvc.show(( answer?.error
                ? answer?.error?.error?.message || answer?.error?.message
                : answer?.response?.message
            ) || 'pages.wallet.error.unknown'
        , true );

        await this.loadingSvc.dismiss();

        return { response: answer.response, error: answer.error };
    }

    protected toOffer( selling: CryptoCurrency, buying: CryptoCurrency, offer: Offer ): Offer {
        return {
            selling: {
                asset_code: selling.assetId,
                asset_issuer: selling.issuerId
            },

            buying: {
                asset_code: buying.assetId,
                asset_issuer: buying.issuerId
            },

            price_r: {
                d: this.exchangeType == ExchangeType.BUY ? offer?.price_r?.d : selling.amount,
                n: this.exchangeType == ExchangeType.BUY ? offer?.price_r?.n : buying.amount
            },

            amount: ( this.exchangeType == ExchangeType.BUY ? buying.amount : selling.amount ) + '',

            id: this.exchangeType == ExchangeType.EDIT ? offer?.id : null,
        }
    }
}
