import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingSvc {

    constructor(
        private loadingCtrl: LoadingController
    ) {}

    async show( message?: string, duration?: number ) {
        return ( await this.loadingCtrl.create({
            message: message ? message : null,
            duration: duration ? duration : null
        })).present();
    }

    async dismiss() {
    return await this.loadingCtrl.dismiss();
    }
}
