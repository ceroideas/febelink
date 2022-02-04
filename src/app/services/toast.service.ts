import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateConfigService } from './translate/translate-config.service';

@Injectable({
  providedIn: 'root',
})
export class ToastSvc {

  constructor(
    private toastCtrl: ToastController
    , private translateSvc: TranslateConfigService
  ) {}

  async show( message: string, translate: boolean = false, duration: number = 5000 ) {
    const toast = await this.toastCtrl.create({
        message: !translate ? message : this.translateSvc.instant( message ),
        duration: duration
      });
      toast.present();
  }
}
