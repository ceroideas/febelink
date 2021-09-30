import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TermsPage } from 'src/app/pages/terms/terms.page';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  constructor(private modalCtrl: ModalController) { }

  async termsModal() {
    const TermsModal = await this.modalCtrl.create({
      component: TermsPage,
    });

    await TermsModal.present();
  }

}
