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
            message: message !== null ? message : undefined,
            duration: duration !== null ? duration : undefined,
        })).present();
    }

    async dismiss() {
    return await this.loadingCtrl.dismiss();
    }
}
