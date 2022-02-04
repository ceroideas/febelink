import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { ExchangeType } from 'src/app/models/wallet/exchange.model';
import { Asset, AssetTypes, Offer } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { ExchangeComponent } from 'src/app/pages/wallet/exchange/exchange.component';
import { LoadingSvc } from '../loading.service';
import { ToastSvc } from '../toast.service';
import { TranslateConfigService } from '../translate/translate-config.service';
import { UserService } from '../user.service';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {

    exchangeType: ExchangeType;
    walletParams: WalletParams;

    constructor(
        private userSvc: UserService
        , private modalCtrl: ModalController
        , private offerSvc: OfferService
        , private loadingSvc: LoadingSvc
        , private toastSvc: ToastSvc
        , private translateSvc: TranslateConfigService
    ) {}

    setParams( walletParams: WalletParams ) {
        this.walletParams = walletParams;
    }

    setType( exchangeType: ExchangeType ) {
        this.exchangeType = exchangeType;
    }

    async show( exchangeType: ExchangeType, walletParams: WalletParams,
        params: { offer?: Offer, origin?: CryptoCurrency, destiny?: CryptoCurrency }
    ): Promise<any> {
        this.setType( exchangeType );
        this.setParams( walletParams );

        if(( await this.redir()))
            return;

        const { data } = await this.present( params );

        return this.OnDone( data, params.offer );
    }

    private async redir() {
        // If user has not verified Data and Email, redirect to profile
        if( !this.walletParams.verified.mandatory ) {
            await this.userSvc.showAlertToRedir();
            return true;
        }

        return false;
    }

    private async present(
        params: { offer?: Offer, origin?: CryptoCurrency, destiny?: CryptoCurrency }
    ) {
        const exchangeModal = await this.modalCtrl.create({
            component: ExchangeComponent,
            componentProps:{
                offer: params?.offer,
                origin: this.cloneCurrency( params.origin, params.offer, true ),
                destiny: this.cloneCurrency( params.destiny, params.offer, false ),
                minnersFee: this.walletParams.minnersFee,
                kycVerified: this.walletParams.verified.kyc,
                
                userWallets: this.walletParams.userWallets,
                retainedTks: this.walletParams.retainedTks,

                assetsMaxDecimals: this.walletParams.assetsMaxDecimals,

                exchangeType: this.exchangeType
            },
            cssClass: 'modal-mobile',
        });
        await exchangeModal.present();

        return await exchangeModal.onDidDismiss();
    }

    private cloneCurrency( currency: CryptoCurrency, offer: Offer, isSelling: boolean
    ): CryptoCurrency
    {
        // If exchangeType == ExchangeType.BUY => flip the values, since you will bid an offer
        const ofAsset: Asset = this.exchangeType == ExchangeType.BUY
            ? ( !isSelling ? offer?.selling : offer?.buying )
            : ( isSelling ? offer?.selling : offer?.buying );

        const amount: number = Number.parseFloat( offer?.amount );
        const price: number = this.exchangeType == ExchangeType.CREATE
            ? 0
            : ( isSelling ? this.offerSvc.calcBuy( amount, offer?.price, this.walletParams?.assetsMaxDecimals ) : amount )

        return {
            currency: currency?.currency || this.assetCode( ofAsset ),
            amount: currency?.amount || price || 0,
            assetId: currency?.assetId || ofAsset?.asset_code,
            issuerId: currency?.issuerId || ofAsset?.asset_issuer,
        }
    }

    private async OnDone( data, offer: Offer ) {
        const origin: CryptoCurrency = data?.origin;
        const destiny: CryptoCurrency = data?.destiny;

        if( origin && destiny ) {
            await this.loadingSvc.show();
            const { response, error } = await this.do( origin, destiny, offer );

            if( error )
                console.log( 'error:', error );

            const msg = ( error
                    ? error?.error?.message || error?.message
                    : response?.message
                ) || this.translateSvc.instant( 'pages.wallet.error.unknown' );
            this.toastSvc.show( msg );

            await this.loadingSvc.dismiss();
            this.walletParams.verified.kyc = true; // Since the only way to get till here is if verified

            return new Promise( resolve => { resolve({ saved: true, response: response, error: error })});
        }

        return new Promise( resolve => { resolve({ saved: false })});
    }

    private async do( origin: CryptoCurrency, destiny: CryptoCurrency, offer: Offer ) {
        switch( this.exchangeType ) {
            case ExchangeType.CREATE:
                return await this.offerSvc.sell( this.toOffer( origin, destiny, offer ));
            case ExchangeType.EDIT:
                return await this.offerSvc.update( this.toOffer( origin, destiny, offer ));
            case ExchangeType.BUY:
                return await this.offerSvc.buy( this.toOffer( origin, destiny, offer ));
        }
    }

    private toOffer( selling: CryptoCurrency, buying: CryptoCurrency, offer: Offer ): Offer {
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

    private assetCode( asset: Asset ) {
        switch( asset?.asset_code ) {
            case AssetTypes.ownAssetTest:
                return AssetTypes.ownAsset
            case AssetTypes.native:
                return AssetTypes.lumens
        }
        return asset?.asset_code || AssetTypes.lumens;
    }
}
