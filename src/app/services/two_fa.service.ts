import { Injectable, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TwoFAComponent } from '../components/two-fa/two-fa.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    public events: EventEmitter<any> = new EventEmitter();

    constructor(
        private popCtrl: PopoverController
    ) { }

    /* Verify 2FA PopoverControll */
    async verify2FA(): Promise<any> {
        const twoFApop = await this.popCtrl.create({
            component: TwoFAComponent,
            cssClass: 'pop-mobile-width',
            backdropDismiss: false // To prevent user cancel on touch outside by error
        });
        await twoFApop.present();

        const { data } = await twoFApop.onDidDismiss();
        return new Promise( resolve => { resolve( data?.verified )});
    }
}
