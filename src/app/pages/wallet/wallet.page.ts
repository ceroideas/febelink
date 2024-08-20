import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { Observable } from 'rxjs';
import {
  CryptoCurrency,
  CryptoTransactions,
} from '../../models/wallet/currency.model';
import { ModalController } from '@ionic/angular';
import { IUser } from '../../models/user.model';
import { DateFormatType } from '../../pipes/date-format.pipe';
import { BuyAssetsComponent } from './buy-assets/buy-assets.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InformComponent } from '../../components/inform/inform.component';
import { UserService } from '../../services/user.service';
import { SendComponent } from './send/send.component';
import { WalletParams } from '../../models/wallet/params.model';
import { OffersListComponent } from './offers-list/offers-list.component';
import { ExchangeType } from '../../models/wallet/exchange.model';
import { ClipboardSvc } from '../../services/clipboard.service';
import { AlertSvc } from '../../services/alert.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';
import { AccountSvc } from '../../services/wallet/account.service';
import { ExchangePop } from '../../services/wallet/exchange.pop';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  host: {ngSkipHydration: 'true'},
})
export class WalletPage {
  @ViewChild('offersList') offersList: OffersListComponent | undefined;

  isLoading: boolean = false;
  user: IUser | undefined;

  walletParams: WalletParams = { userWallets: [] };
  transactions: CryptoTransactions | undefined;

  hideRetained: boolean = true;
  hideTransactions: boolean = true;

  // dateFormatType = DateFormatType;
  dateFormatType: DateFormatType = DateFormatType.SomeValue; // Replace SomeValue with the appropriate value

  exchangeTypes = ExchangeType;

  constructor(
    private walletSvc: WalletService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private exchangePop: ExchangePop,
    private router: Router,
    private alertSvc: AlertSvc,
    private clipboardSvc: ClipboardSvc,
    private translateSvc: TranslateConfigService,
    private accountSvc: AccountSvc,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.getWalletInfo();
    await this.haveYouPurchased();

    this.checkIfShowBuyTokenModal();
  }

  checkIfShowBuyTokenModal() {
    const buyTokenLinkCurrency = this.route.snapshot.paramMap.get('currency');
    if (buyTokenLinkCurrency) {
      this.showBuyTokenModal(buyTokenLinkCurrency);
    }
  }

  async showBuyTokenModal(buyTokenLinkCurrency: string) {
    const serviceRequest: Observable<any> = await this.walletSvc
      .getWalletInfo()
      .then();
    serviceRequest.subscribe((response) => {
      const currency = this.walletParams?.userWallets?.filter(
        (walletCurrency) => {
          return walletCurrency.currency === buyTokenLinkCurrency;
        }
      );
      if (currency) this.buy(currency[0]);
    });
  }

  async haveYouPurchased() {
    const params = (<any>this.route.snapshot.queryParamMap).params;

    if (params['bought'] != 'false' && params['bought'] != 'true') return;

    const bought = params['bought'] == 'true';
    const assetId = params['assetId'];
    const numTokens = params['numTokens'];
    const cash = params['cash'];
    const priceBuy = params['priceBuy'];

    const exchangeModal = await this.modalCtrl.create({
      component: InformComponent,
      componentProps: {
        pompadour: this.translateSvc.instant(
          'pages.wallet.purchase.title-' + (bought ? 'success' : 'error')
        ),
        description: this.translateSvc.instant(
          'pages.wallet.purchase.msg-' + (bought ? 'success' : 'error')
        ),
        showCheckmark: bought,
      },
      cssClass: 'pop-w-300 pop-h-400 pop-opacity pop-br-10',
    });
    await exchangeModal.present();
  }

  public goBack(): void {
    this.router.navigate(['/' + environment.HOME_PAGE]);
  }

  public async send() {
    // If user has not verified Data and Email, redirect to profile
    if (!this.walletParams.verified?.mandatory) {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const userWallet = this.walletParams?.userWallets?.[0];
    const asset = userWallet ? userWallet.assetId : undefined;

    const sendTksModal = await this.modalCtrl.create({
      component: SendComponent,
      componentProps: {
        asset: asset,
        retainedTks: this.walletParams.retainedTks,
        assetsMaxDecimals: this.walletParams.assetsMaxDecimals,

        returnBalance: true,
      },
      cssClass: 'modal-mobile',
    });
    await sendTksModal.present();

    const { data } = await sendTksModal.onDidDismiss();

    if (data?.response) this.setVars(data.response);
  }

  async getWalletInfo() {
    this.isLoading = true;
    const serviceRequest: Observable<any> = await this.walletSvc
      .getWalletInfo()
      .then();
    serviceRequest.subscribe((response) => this.setVars(response));
  }

  setVars(response: any) {
    this.walletParams.publicKey = response.publicKey;
    this.walletParams.privateKey = response.privateKey;
    this.walletParams.userWallets = response.data;
    this.walletParams.retainedTks = response.retainedTks;
    this.walletParams.verified = response.verified;
    this.transactions = response.transacciones;
    this.walletParams.minnersFee = response.minnersFee;
    this.isLoading = false;
    this.walletParams.stripeFee = response.stripeFee;
    this.walletParams.assetsMaxDecimals = Number(
      response.assetsMaxDecimals || '0'
    );
    this.cdRef.detectChanges();
  }

  async copyPublicKey() {
    this.clipboardSvc.copy(this.walletParams.publicKey);
  }

  async copyPrivateKey() {
    this.clipboardSvc.copy(this.walletParams.privateKey);
  }

  async exchange(currency: CryptoCurrency) {
    const { saved, response, error } = await this.exchangePop.show(
      ExchangeType.CREATE,
      this.walletParams,
      {
        sell: {
          currency: currency?.currency,
          assetId: currency?.assetId,
          priceBuy: currency?.priceBuy,
          issuerId: currency?.issuerId,
        },
      }
    );

    if (saved && !error) this.offersList?.refresh();
  }
  refresh() {
    this.offersList?.refresh();
  }

  showHelp() {
    this.alertSvc.show(
      {
        title: 'pages.wallet.help.title',
        msg: 'pages.wallet.help.message',
        css: 'alertSmallTitle',
      },
      true
    );
  }

  async buy(currency: any) {
    // If user has no Public Key or has not verified account
    if (!this.walletParams.publicKey || !this.walletParams.verified?.account) {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const exchangeModal = await this.modalCtrl.create({
      component: BuyAssetsComponent,
      componentProps: {
        asset: currency,
        minnersFee: parseFloat(this.walletParams.minnersFee || '0'),
        stripeFee: parseFloat(this.walletParams.stripeFee || '0'),
        assetsMaxDecimals: this.walletParams.assetsMaxDecimals,
      },
      cssClass: 'pop-mobile-width',
    });
    await exchangeModal.present();

    const { data } = await exchangeModal.onDidDismiss();

    const sell = data?.sell;
    const buy = data?.buy;
  }

  transaction(operation: any) {
    console.log('operation:', operation);
  }

  async balance() {
    const { response, error } = await this.accountSvc.balance();
    if (!error) this.walletParams.userWallets = response;
  }
}
