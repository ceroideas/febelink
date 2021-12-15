import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { CryptoCurrency } from 'src/app/models/currency.model';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalController } from '@ionic/angular';
import { ExchangeComponent } from './exchange/exchange.component';
@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  userWallets: CryptoCurrency[] = [];
  publicKey: string;

  constructor(
      private location: Location
    , private walletService: WalletService
    , private clipboard: Clipboard
    , private utilities: UtilitiesService
    , private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getPublicKey();
    this.getCurrencyList();
  }

  public goBack(): void {
    this.location.back();
  }

  async getPublicKey() {
    const serviceRequest: Observable<any> = await this.walletService
      .getPublicKey()
      .then();
    serviceRequest.subscribe((response) => {
      console.log( 'response: ', response );
      this.publicKey = response.publicKey;
    });
  }

  copyPublicKey() {
    this.clipboard.copy( this.publicKey );
    this.utilities.showToast( 'Copied to Clipboard' );
  }

  async getCurrencyList() {
    const serviceRequest: Observable<any> = await this.walletService
      .getBalanceByUserId('CUSTOM1')
      .then();
    serviceRequest.subscribe((response) => {
      this.userWallets = response.data;
    });
  }

  async exchage( currency: CryptoCurrency ) {
    const exchangeModal = await this.modalCtrl.create({
      component: ExchangeComponent,
      componentProps:{
        origin: currency
      }
    });
    await exchangeModal.present();

    exchangeModal.onDidDismiss().then(async (response) => {
      console.log( 'response: ', response );
    })
  }
}
