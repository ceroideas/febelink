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
  minnersFee: string;

  constructor(
      private location: Location
    , private walletService: WalletService
    , private clipboard: Clipboard
    , private utilities: UtilitiesService
    , private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getWalletInfo();
  }

  public goBack(): void {
    this.location.back();
  }

  async getWalletInfo() {
    const serviceRequest: Observable<any> = await this.walletService
      .getWalletInfo()
      .then();
    serviceRequest.subscribe((response) => {
      this.publicKey = response.publicKey;
      this.userWallets = response.balance;
      this.minnersFee = response.minnersFee;
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
        origin: { currency: currency.currency, ammount: 0 },
        minnersFee: this.minnersFee
      },
      cssClass: 'modal-mobile',
    });
    await exchangeModal.present();

    exchangeModal.onDidDismiss().then(async ( response ) => {
      const origin = response?.data?.origin;
      const destiny = response?.data?.destiny;

      if( origin && destiny ) {
        this.utilities.showLoading();
        const response = await this.walletService.exchange( origin, destiny );
        this.utilities.dismissLoading();
        this.utilities.showToast( response?.message || 'Desconozco el Resultado del Exchange' );
      }
    })
  }
}
