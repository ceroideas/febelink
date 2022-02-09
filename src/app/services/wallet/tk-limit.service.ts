import { Injectable } from '@angular/core';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { AssetTypes } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';

@Injectable({
  providedIn: 'root',
})
export class TkLimitSvc
{
    constructor() {}

    qantRetained( asset: CryptoCurrency, retainedTks: TokensUser[] )
    {
        if( asset?.currency !== AssetTypes.ownAsset ) return 0;
        
        let retained = 0;
        retainedTks?.forEach( tk => retained += Number( tk?.num_tokens || '0' ));

        return retained;
    }

    qantAsset( asset: CryptoCurrency, userWallet: CryptoCurrency[]): number
    {
        for( let i = 0; i < userWallet?.length; i++ )
            if( userWallet[ i ]?.currency === asset?.currency )
                return userWallet[ i ]?.amount || 0
        
        return 0
    }

    qantAvailable( asset: CryptoCurrency, walletParams: WalletParams )
    {
        return this.qantAsset( asset, walletParams.userWallets )
            - this.qantRetained( asset, walletParams.retainedTks )
    }

    // The user has that amount available in their wallet => amount >= assetsQant - retained
    exceeds( amount: number, asset: CryptoCurrency, walletParams: WalletParams )
    {
        return amount > this.qantAvailable( asset, walletParams )
    }
}
