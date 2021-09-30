import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LegalDisclaimerPage } from 'src/app/pages/legal-disclaimer/legal-disclaimer.page';
import { TermsPage } from 'src/app/pages/terms/terms.page';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  constructor(
    private modalCtrl: ModalController
    ) { }

  async termsModal() {
    const TermsModal = await this.modalCtrl.create({
      component: TermsPage,
    });

    await TermsModal.present();
  }

  async openLegalDisclaimer() {
    const TermsModal = await this.modalCtrl.create({
      component: LegalDisclaimerPage,
    });

    await TermsModal.present();
  }

}
