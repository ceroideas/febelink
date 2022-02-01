import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { SelectAssetComponent } from 'src/app/pages/wallet/select-asset/select-asset.component';

@Injectable({
  providedIn: 'root',
})
export class AssetService {

    constructor(
        private popCtrl: PopoverController
    ) {}

    getImg( asset: string ) {
        switch( ( asset || '' ).toUpperCase() ) {
            case 'FLAU':
            case 'FBLINKCOINV3':
                return 'flau';
            default:
                return 'xlm';
        }
    }

    getColor( asset: string ) {
        switch( ( asset || '' ).toUpperCase() ) {
            case 'FLAU':
            case 'FBLINKCOINV3':
                return 'febelink';
            default:
                return 'black';
        }
    }

    async select(
        event,
        assetTpes: CryptoCurrency[],
        exceptCrypto?: CryptoCurrency
    ): Promise<CryptoCurrency>
    {
        const popover = await this.popCtrl.create({
            event: event,
            component: SelectAssetComponent,
            translucent: true,
            mode: 'md',
            componentProps: {
                assetTypes: assetTpes,
                except: exceptCrypto?.currency
            }
        });
    
        await popover.present();
    
        const { data } = await popover.onDidDismiss();

        return new Promise( resolve => { resolve( data?.asset as CryptoCurrency )});
    }
}
