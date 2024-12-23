import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AskForBudgetComponent } from '../components/ask-for-budget/ask-for-budget.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

    /**
   * Objeto modal
   */
  private _modal: HTMLIonModalElement | undefined = undefined;

  constructor(
    private modalCtrl: ModalController,
  ) {}

  /** 
   * Cierra modal de suscripcion
   */
 close() {
   this._modal?.dismiss();
   this._modal = undefined;
 }

  async openAskForBudgetModal() {
    this._modal = await this.modalCtrl.create({
      cssClass: "",
      component: AskForBudgetComponent,
      mode: "ios",
    });
    this._modal.present();
  }
}
