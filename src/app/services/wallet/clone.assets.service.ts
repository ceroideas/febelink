import { Injectable } from '@angular/core';
import { CryptoCurrency, CryptoCurrencyType } from 'src/app/models/wallet/currency.model';
import { ExchangeType } from 'src/app/models/wallet/exchange.model';
import { Asset, AssetTypes, Offer } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root',
})
export class CloneAssetSvc
{
    private exchangeType: ExchangeType
    private offer: Offer
    private walletParams: WalletParams

    constructor(
        private offerSvc: OfferService
    ) {}

    set( exchangeType: ExchangeType , offer: Offer , walletParams: WalletParams ) {
        this.exchangeType = exchangeType;
        this.offer = offer;
        this.walletParams = walletParams;
    }

    // This is to get as default the first asset available different than the opposite one
    // It is allways in this order: [ OWN, XLM, ... ]
    get( self: CryptoCurrency, opposite: CryptoCurrency, isSell: boolean )
    {
        if( self?.currency || this.offer )
            return this.cloneCurrency( self, isSell );

        for( let i = 0; i < this.walletParams.userWallets.length; i++ )
            if( this.walletParams.userWallets[ i ]?.currency != opposite?.currency &&
                ( this.walletParams.userWallets[ i ]?.issuerId ||
                  this.walletParams.userWallets[ i ]?.currency == CryptoCurrencyType.lumens
                )
            )
                return this.cloneCurrency( this.walletParams.userWallets[ i ], isSell );
    }

    private cloneCurrency( currency: CryptoCurrency , isSell: boolean ): CryptoCurrency
    {
        // If exchangeType == ExchangeType.BUY => flip the values, since you will bid an offer
        const ofAsset: Asset = this.exchangeType == ExchangeType.BUY
            ? ( !isSell ? this.offer?.selling : this.offer?.buying )
            : ( isSell ? this.offer?.selling : this.offer?.buying );

        const maxDecimals = this.walletParams.assetsMaxDecimals;
        const amount: number = Number.parseFloat( this.offer?.amount );
        const price: number = this.exchangeType == ExchangeType.CREATE ? 0
            : ( this.exchangeType == ExchangeType.BUY
                ? ( !isSell ? amount : this.offerSvc.calcBuy( amount, this.offer?.price, maxDecimals ))
                : ( isSell ? amount : this.offerSvc.calcBuy( amount, this.offer?.price, maxDecimals ))
            )
        
        // console.log({ ofAsset, amount, price, currency, isSell, offer: this.offer });

        return {
            currency: this.assetCode( ofAsset ) || currency?.currency,
            amount: price,
            assetId: ofAsset?.asset_code || currency?.assetId,
            issuerId: ofAsset?.asset_issuer || currency?.issuerId,
        }
    }

    private assetCode( asset: Asset ) {
        if( asset?.asset_type == AssetTypes.native )
            return AssetTypes.lumens;
        
        switch( asset?.asset_code ) {
            case AssetTypes.ownAssetTest:
                return AssetTypes.ownAsset
            case AssetTypes.native:
                return AssetTypes.lumens
        }
        return asset?.asset_code || null;
    }
}
