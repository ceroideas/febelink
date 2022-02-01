import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { Asset, AssetTypes, Offer, Price } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { ExchangeComponent } from 'src/app/pages/wallet/exchange/exchange.component';
import { UserService } from '../user.service';
import { UtilitiesService } from '../utilities.service';
import { OfferService } from './offer.service';

export enum ExchangeType {
    CREATE = 'create',
    EDIT = 'edit',
    BUY = 'buy',
    DELETE = 'delete'
}

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {

    exchangeType: ExchangeType;
    walletParams: WalletParams;

    constructor(
        private userSvc: UserService
        , private utilities: UtilitiesService
        , private modalCtrl: ModalController
        , private offerSvc: OfferService
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
            origin: this.cloneCurrency( params.origin, params.offer, true ),
            destiny: this.cloneCurrency( params.destiny, params.offer, false ),
            minnersFee: this.walletParams.minnersFee,
            kycVerified: this.walletParams.verified.kyc,
            
            userWallets: this.walletParams.userWallets,
            retainedTks: this.walletParams.retainedTks,

            exchangeType: this.exchangeType
            },
            cssClass: 'modal-mobile',
        });
        await exchangeModal.present();

        return await exchangeModal.onDidDismiss();
    }

    private cloneCurrency( currency: CryptoCurrency, offer: Offer, isSelling: boolean ): CryptoCurrency
    {
        const ofAsset: Asset = isSelling ? offer?.selling : offer?.buying;
        const price_r: Price = offer?.price_r;
        return {
            currency: currency?.currency || this.assetCode( ofAsset ),
            amount: currency?.amount || ( isSelling ? price_r?.d : price_r?.n ) || 0,
            assetId: currency?.assetId || ofAsset?.asset_code,
            issuerId: currency?.issuerId || ofAsset?.asset_issuer,
        }
    }

    private async OnDone( data, offer: Offer ) {
        const origin: CryptoCurrency = data?.origin;
        const destiny: CryptoCurrency = data?.destiny;
        console.log( 'origin', origin );
        console.log( 'destiny', destiny );

        if( origin && destiny ) {
            this.utilities.showLoading();
            let response;
            try {
                response = await this.do( origin, destiny, offer );
                this.utilities.showToast(
                    response?.message ||
                    this.utilities.translateService.instant( 'pages.wallet.error.unknown' )
                );
            } catch(err) {
                console.log( 'error:', err );
                response = err;
                
                this.utilities.showToast( err?.error?.message || err?.message || 'There`s been an error'  );
            }

            this.utilities.dismissLoading();

            this.walletParams.verified.kyc = true; // Since the only way to get till here is if verified

            return new Promise( resolve => { resolve( response )});
        }

        return new Promise( resolve => { resolve( null )});
    }

    private async do( origin: CryptoCurrency, destiny: CryptoCurrency, offer: Offer ) {
        switch( this.exchangeType ) {
            case ExchangeType.CREATE:
                return await this.offerSvc.sell( this.toOffer( origin, destiny, offer ));
            case ExchangeType.EDIT:
                return await this.offerSvc.update( this.toOffer( origin, destiny, offer ));
            case ExchangeType.BUY:
                return await this.offerSvc.buy( this.toOffer( destiny, origin, offer ));
        }
    }

    private toOffer( origin: CryptoCurrency, destiny: CryptoCurrency, offer: Offer ): Offer {
        return {
            selling: {
                asset_code: origin.assetId,
                asset_issuer: origin.issuerId
            },

            buying: {
                asset_code: destiny.assetId,
                asset_issuer: destiny.issuerId
            },

            price_r: {
                d: origin.amount,
                n: destiny.amount
            },

            amount: offer?.amount,

            id: offer?.id
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
