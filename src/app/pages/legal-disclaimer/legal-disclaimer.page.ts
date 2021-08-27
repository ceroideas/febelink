import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-legal-disclaimer',
  templateUrl: './legal-disclaimer.page.html',
  styleUrls: ['./legal-disclaimer.page.scss'],
})
export class LegalDisclaimerPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  /**
   * Close modal
   */
   public closeModal(): void {
    this.modalCtrl.dismiss();
  }

}
