import { Injectable } from '@angular/core';
import { CryptoCurrency, CryptoCurrencyType } from '../../models/wallet/currency.model';
import { ExchangeType } from '../../models/wallet/exchange.model';
import { Asset, AssetTypes, Offer } from '../../models/wallet/offers.models';
import { WalletParams } from '../../models/wallet/params.model';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root',
})
export class CloneAssetSvc
{
    //@ts-ignore
    private exchangeType: ExchangeType;
    //@ts-ignore

    private offer: Offer
    //@ts-ignore

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
    get(self: CryptoCurrency, opposite: CryptoCurrency, isSell: boolean) {
        if (self?.currency || this.offer) {
            return this.cloneCurrency(self, isSell);
        }
    
        const userWallets = this.walletParams?.userWallets ?? [];
    
        for (let i = 0; i < userWallets.length; i++) {
            if (userWallets[i]?.currency !== opposite?.currency &&
                (userWallets[i]?.issuerId || userWallets[i]?.currency === CryptoCurrencyType.lumens)
            ) {
                return this.cloneCurrency(userWallets[i], isSell);
            }
        }

        return 
    }

    private cloneCurrency( currency: CryptoCurrency , isSell: boolean ): CryptoCurrency
    {
        // If exchangeType == ExchangeType.BUY => flip the values, since you will bid an offer
        const ofAsset: Asset = this.exchangeType == ExchangeType.BUY
            ? ( !isSell ? this.offer?.selling : this.offer?.buying )
            : ( isSell ? this.offer?.selling : this.offer?.buying );

        const maxDecimals = this.walletParams.assetsMaxDecimals;
        const amount: number = Number.parseFloat( this.offer?.amount );
        const price: any = this.exchangeType === ExchangeType.CREATE
        ? 0
        : (this.exchangeType === ExchangeType.BUY
            ? (!isSell ? amount : this.offer?.price ?? 0) // Use 0 as default price if this.offer?.price is null or undefined
            : (isSell ? amount : this.offer?.price ?? 0) // Use 0 as default price if this.offer?.price is null or undefined
        );
    
        
        // console.log("test ceroideas",{ ofAsset, amount, price, currency, isSell, offer: this.offer });

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
