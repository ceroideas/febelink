import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { CryptoCurrency, CryptoTransactions } from 'src/app/models/currency.model';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalController } from '@ionic/angular';
import { ExchangeComponent } from './exchange/exchange.component';
import { IUser } from 'src/app/models/user.model';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { DateFormatType } from 'src/app/pipes/date-format';
import { BuyAssetsComponent } from './buy-assets/buy-assets.component';
import { ActivatedRoute } from '@angular/router';
import { InformComponent } from 'src/app/components/inform/inform.component';
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
  retainedTks: TokensUser[];
  kycVerified: boolean;
  transactions: CryptoTransactions;
  minnersFee: string;
  stripeFee: string;

  hideRetained: boolean = true;
  hideTransactions: boolean = false;

  dateFormatType = DateFormatType;

  isAdmin: boolean = false;

  constructor(
      private location: Location
    , private walletSvc: WalletService
    , private utilities: UtilitiesService
    , private modalCtrl: ModalController
    , private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.getWalletInfo();
    this.haveYouPurchased();
    this.isAdmin = await this.utilities.isAdmin();
  }

  async haveYouPurchased() {
    const params = ( <any> this.route.snapshot.queryParamMap ).params;
    console.log( 'what are the params: ', params );

    if( params[ 'bought' ] != 'false' && params[ 'bought' ] != 'true' )
      return;
    
    const bought = params[ 'bought' ] == 'true';
    const assetId = params[ 'assetId' ];
    const numTokens = params[ 'numTokens' ];
    const totalTokensCost = params[ 'totalTokensCost' ];
    const priceBuy = params[ 'priceBuy' ]
    
    const exchangeModal = await this.modalCtrl.create({
      component: InformComponent,
      componentProps:{
        pompadour: this.utilities.translateService.instant( 'pages.wallet.purchase.title-' + ( bought ? 'success' : 'error' )),
        description: this.utilities.translateService.instant( 'pages.wallet.purchase.msg-' + ( bought ? 'success' : 'error' ),
          { tokens: numTokens, price: totalTokensCost }),
        showCheckmark: bought,
      },
      cssClass: 'pop-w-300 pop-h-400 pop-opacity pop-br-10',
    });
    await exchangeModal.present();
  }

  public goBack(): void {
    this.location.back();
  }

  async getWalletInfo() {
    this.isLoading = true;
    const serviceRequest: Observable<any> = await this.walletSvc
      .getWalletInfo()
      .then();
    serviceRequest.subscribe((response) => this.setVars( response ));
  }

  setVars( response ) {
    this.publicKey = response.publicKey;
    this.userWallets = response.data;
    this.retainedTks = response.retainedTks;
    this.kycVerified = response[ 'kyc-verified' ];
    this.transactions = response.transacciones;
    this.minnersFee = response.minnersFee;
    this.isLoading = false;
    this.stripeFee = response.stripeFee;
    console.log( 'response: ', response );
  }

  async copyPublicKey() {
    this.utilities.copyClipboard( this.publicKey );
  }

  async exchange( currency: CryptoCurrency ) {
    if( !this.isAdmin ) {
      this.utilities.showToast( this.utilities.translateService.instant( 'common.unavailable' ));
      return;
    }

    const exchangeModal = await this.modalCtrl.create({
      component: ExchangeComponent,
      componentProps:{
        origin: { currency: currency.currency, amount: 0 },
        minnersFee: this.minnersFee,
        kycVerified: this.kycVerified,
        
        userWallets: this.userWallets,
        retainedTks: this.retainedTks
      },
      cssClass: 'modal-mobile',
    });
    await exchangeModal.present();

    const { data } = await exchangeModal.onDidDismiss();

    const origin = data?.origin;
    const destiny = data?.destiny;

    if( origin && destiny ) {
      this.utilities.showLoading();
      const response = await this.walletSvc.exchange( origin, destiny );
      this.setVars( response );

      this.utilities.dismissLoading();
      this.utilities.showToast( response?.message || this.utilities.translateService.instant( 'pages.wallet.error.unknown' ));

      this.kycVerified = true; // Since the only way to get till here is if verified
    }
  }

  showHelp() {
    this.utilities.showAlert(
      this.utilities.translateService.instant( 'pages.wallet.help.title' ),
      this.utilities.translateService.instant( 'pages.wallet.help.message' ),
      'alertSmallTitle'
    );
  }

  async buy(  currency ) {
    const exchangeModal = await this.modalCtrl.create({
      component: BuyAssetsComponent,
      componentProps:{
        asset: currency,
        minnersFee: parseFloat( this.minnersFee || '0' ),
        stripeFee: parseFloat( this.stripeFee || '0' ),
      },
      cssClass: 'pop-mobile-width',
    });
    await exchangeModal.present();

    const { data } = await exchangeModal.onDidDismiss();

    const origin = data?.origin;
    const destiny = data?.destiny;
  }
}
