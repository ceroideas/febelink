import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { CryptoCurrency } from 'src/app/models/currency.model';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalController, Platform } from '@ionic/angular';
import { ExchangeComponent } from './exchange/exchange.component';
import { IUser } from 'src/app/models/user.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  isLoading: boolean = false;
  user: IUser;

  userWallets: CryptoCurrency[] = [];
  publicKey: string;
  retainedTks: string;
  transactions: any[];
  minnersFee: string;

  constructor(
      private location: Location
    , private walletService: WalletService
    , private clipboard: Clipboard
    , private utilities: UtilitiesService
    , private modalCtrl: ModalController
    , private translateSvc: TranslateConfigService
    , private platform: Platform
  ) {}

  ngOnInit() {
    this.getWalletInfo();
  }

  public goBack(): void {
    this.location.back();
  }

  async getWalletInfo() {
    this.isLoading = true;
    const serviceRequest: Observable<any> = await this.walletService
      .getWalletInfo()
      .then();
    serviceRequest.subscribe((response) => {
      this.publicKey = response.publicKey;
      this.userWallets = response.balance;
      this.retainedTks = response.retainedTks;
      this.transactions = response.transactions;
      this.minnersFee = response.minnersFee;
      this.isLoading = false;
    });
  }

  async copyPublicKey() {
    if ( this.platform.is( 'cordova' )) // Native Android/iOS
      this.clipboard.copy( this.publicKey );
    else // Web
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText( this.publicKey );
        } catch ( err ) {
          console.log( 'Error on Clipboard: ', err );
          return;
        }
      }

    this.utilities.showToast( this.translateSvc.instant( 'common.clipboard' ));
  }

  async getCurrencyList() {
    const serviceRequest: Observable<any> = await this.walletService
      .getBalanceByUserId('CUSTOM1')
      .then();
    serviceRequest.subscribe((response) => {
      this.userWallets = response.data;
    });
  }

  async exchange( currency: CryptoCurrency ) {
    if( !await this.utilities.isAdmin() ) {
      this.utilities.showToast( this.translateSvc.instant( 'common.unavailable' ));
      return;
    }

    const exchangeModal = await this.modalCtrl.create({
      component: ExchangeComponent,
      componentProps:{
        origin: { currency: currency.currency, ammount: 0 },
        minnersFee: this.minnersFee
      },
      cssClass: 'modal-mobile',
    });
    await exchangeModal.present();

    const { data } = await exchangeModal.onDidDismiss();

    const origin = data?.origin;
    const destiny = data?.destiny;

    if( origin && destiny ) {
      this.utilities.showLoading();
      const response = await this.walletService.exchange( origin, destiny );
      this.utilities.dismissLoading();
      this.utilities.showToast( response?.message || this.translateSvc.instant( 'pages.wallet.error.unknown' ));
    }
  }
}
