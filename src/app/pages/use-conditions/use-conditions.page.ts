import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-use-conditions',
  templateUrl: './use-conditions.page.html',
  styleUrls: ['./use-conditions.page.scss'],
})
export class UseConditionsPage implements OnInit {

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
