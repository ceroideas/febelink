import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { KYCAliceComponent } from 'src/app/components/kyc-alice/kyc-alice.component';
import { AlertSvc } from '../alert.service';
import { ToastSvc } from '../toast.service';

@Injectable({
  providedIn: 'root',
})
export class KycPopSvc {

    constructor(
        private popCtrl: PopoverController
        , private alertSvc: AlertSvc
        , private toastSvc: ToastSvc
    ) {}

    async verify(): Promise<boolean>
    {
        const popover = await this.popCtrl.create({
          component: KYCAliceComponent,
          translucent: true,
          mode: 'md',
          cssClass: 'pop-yt',
          backdropDismiss: false // To prevent user cancel on touch outside by error
        });
    
        await popover.present();
    
        // The data always returns `data.result`
        const { data } = await popover.onDidDismiss();
    
        this.toastSvc.show( `kyc.${ data.result.isValidated ? '' : 'un' }verified`, true );
        return new Promise( resolve => { resolve( data.result.isValidated ) });
    }

    preVerify(): Promise<boolean>
    {
        return new Promise( async resolve => {
            const lang = 'kyc.alert.complete.';
            this.alertSvc.show({
                title: lang + 'head',
                msg: lang + 'msg',
                btns: [
                    {
                        text: 'common.buttons.got-it',
                        handler: () => this.doVerify( resolve )
                    }
                ]
            }, true);
        });
    }

    private async doVerify( resolve ) {
        resolve( await this.verify() )
    }
}
