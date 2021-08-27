import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.page.html',
  styleUrls: ['./cookie-policy.page.scss'],
})
export class CookiePolicyPage implements OnInit {

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
