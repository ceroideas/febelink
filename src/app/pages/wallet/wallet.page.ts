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
import { ActivatedRoute, Router } from '@angular/router';
import { InformComponent } from 'src/app/components/inform/inform.component';
import { UserService } from 'src/app/services/user.service';
import { SendComponent } from './send/send.component';
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
  verified: { account: boolean, mandatory: boolean, kyc: boolean }
  transactions: CryptoTransactions;
  minnersFee: string;
  stripeFee: string;
  assetsMaxDecimals: number;

  hideRetained: boolean = true;
  hideTransactions: boolean = false;

  dateFormatType = DateFormatType;

  isAdmin: boolean = false;

  constructor(
      private location: Location
    , private walletSvc: WalletService
    , private utilities: UtilitiesService
    , private modalCtrl: ModalController
    , private route: ActivatedRoute
    , private userSvc: UserService
    , private router: Router
  ) {}

  ngOnInit() {}
  
  async ionViewWillEnter() {
    this.getWalletInfo();
    this.haveYouPurchased();
    this.isAdmin = await this.utilities.isAdmin();
  }

  async haveYouPurchased() {
    const params = ( <any> this.route.snapshot.queryParamMap ).params;

    if( params[ 'bought' ] != 'false' && params[ 'bought' ] != 'true' )
      return;
    
    const bought = params[ 'bought' ] == 'true';
    const assetId = params[ 'assetId' ];
    const numTokens = params[ 'numTokens' ];
    const cash = params[ 'cash' ];
    const priceBuy = params[ 'priceBuy' ]
    
    const exchangeModal = await this.modalCtrl.create({
      component: InformComponent,
      componentProps:{
        pompadour: this.utilities.translateService.instant( 'pages.wallet.purchase.title-' + ( bought ? 'success' : 'error' )),
        description: this.utilities.translateService.instant( 'pages.wallet.purchase.msg-' + ( bought ? 'success' : 'error' )),
        showCheckmark: bought,
      },
      cssClass: 'pop-w-300 pop-h-400 pop-opacity pop-br-10',
    });
    await exchangeModal.present();
  }

  public goBack(): void {
    this.router.navigate(['/menu/todas']);
  }

  public async send() {
    // If user has not verified Data and Email, redirect to profile
    if( !this.verified.mandatory ) {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const sendTksModal = await this.modalCtrl.create({
      component: SendComponent,
      componentProps: {
        asset: this.userWallets[ 0 ],
        retainedTks: this.retainedTks,
        assetsMaxDecimals: this.assetsMaxDecimals,

        returnBalance: true
      },
      cssClass: 'modal-mobile',
    });
    await sendTksModal.present();

    const { data } = await sendTksModal.onDidDismiss();

    if( data?.response )
      this.setVars( data.response );
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
    this.verified = response.verified;
    this.transactions = response.transacciones;
    this.minnersFee = response.minnersFee;
    this.isLoading = false;
    this.stripeFee = response.stripeFee;
    this.assetsMaxDecimals = Number( response.assetsMaxDecimals || '0' );
  }

  async copyPublicKey() {
    this.utilities.copyClipboard( this.publicKey );
  }

  async exchange( currency: CryptoCurrency ) {
    // ToDo: Remove This after Exchange Done
    if( !this.isAdmin ) {
      this.utilities.showToast( this.utilities.translateService.instant( 'common.unavailable' ));
      return;
    }

    // If user has not verified Data and Email, redirect to profile
    if( !this.verified.mandatory ) {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const exchangeModal = await this.modalCtrl.create({
      component: ExchangeComponent,
      componentProps:{
        origin: { currency: currency.currency, amount: 0 },
        minnersFee: this.minnersFee,
        kycVerified: this.verified.kyc,
        
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

      this.verified.kyc = true; // Since the only way to get till here is if verified
    }
  }

  showHelp() {
    this.utilities.showAlert(
      this.utilities.translateService.instant( 'pages.wallet.help.title' ),
      this.utilities.translateService.instant( 'pages.wallet.help.message' ),
      'alertSmallTitle'
    );
  }

  async buy( currency ) {
    // If user has no Public Key or has not verified account
    if( !this.publicKey || !this.verified.account ) {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const exchangeModal = await this.modalCtrl.create({
      component: BuyAssetsComponent,
      componentProps:{
        asset: currency,
        minnersFee: parseFloat( this.minnersFee || '0' ),
        stripeFee: parseFloat( this.stripeFee || '0' ),
        assetsMaxDecimals: this.assetsMaxDecimals,
      },
      cssClass: 'pop-mobile-width',
    });
    await exchangeModal.present();

    const { data } = await exchangeModal.onDidDismiss();

    const origin = data?.origin;
    const destiny = data?.destiny;
  }
}
