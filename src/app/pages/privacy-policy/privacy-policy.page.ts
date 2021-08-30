import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegistroPage } from '../registro/registro.page';
import { CookiePolicyPage } from '../cookie-policy/cookie-policy.page';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  register: RegistroPage;

  constructor(private modalCtrl: ModalController) {
   
   }

  ngOnInit() {
  }

  /**
   * Close modal
   */
   public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  async openCookiePolicy() {
    const cookiesModal = await this.modalCtrl.create({
      component: CookiePolicyPage,
    });
    return await cookiesModal.present();
   
  }

}
