import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CryptoCurrency, CryptoCurrencyType } from 'src/app/models/wallet/currency.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KYCAliceComponent } from 'src/app/components/kyc-alice/kyc-alice.component';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { TwoFAService } from 'src/app/services/two_fa.service';
import { Offer } from 'src/app/models/wallet/offers.models';
import { ExchangeType } from 'src/app/models/wallet/exchange.model';
import { OfferService } from 'src/app/services/wallet/offer.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { AlertSvc } from 'src/app/services/alert.service';
import { KycPopSvc } from 'src/app/services/kyc/kyc.pop.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {

  @Input() offer: Offer;
  @Input() origin: CryptoCurrency = {};
  @Input() destiny: CryptoCurrency = {};
  @Input() minnersFee: string;
  @Input() kycVerified: boolean = true;
  @Input() exchangeType: ExchangeType = ExchangeType.CREATE;
  
  @Input() userWallets: CryptoCurrency[] = [];
  @Input() retainedTks: TokensUser[];
  @Input() assetsMaxDecimals: number;
  
  public form: FormGroup;
  exchangesType = ExchangeType;

  constructor(
      private modalController: ModalController
    , private formBuilder: FormBuilder
    , private popCtrl: PopoverController
    , private alertSvc: AlertSvc
    , private toastSvc: ToastSvc
    , public assetSvc: AssetService
    , private twoFASvc: TwoFAService
    , private offerSvc: OfferService
    , private kycPopSvc: KycPopSvc
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ionViewDidLeave() {
    this.form.reset();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      num_sell: new FormControl(( this.origin?.amount > 0 ? this.origin?.amount : '' ), [ Validators.required ]),
      num_buy: new FormControl(( this.destiny?.amount > 0 ? this.destiny?.amount : '' ), [ Validators.required ])
    });
  }

  onDismiss( ) {
    this.modalController.dismiss({ });
  }
  
  async selectAsset( event, isOrigin: boolean ) {
    const asset = await this.assetSvc.select(
          event
        , this.userWallets
        , !isOrigin ? this.origin : this.destiny
    );

    // Only do if asset selected
    if( !asset )
      return;

    if( isOrigin )
      this.origin.currency = asset.currency;
    else
      this.destiny.currency = asset.currency;
  }

  switchAssets() {
    if( this.exchangeType == ExchangeType.BUY ) {
      this.toastSvc.show( 'pages.wallet.exchange.cant-switch', true );
      return;
    }

    const selling: CryptoCurrency =
      { currency: this.destiny?.currency, assetId: this.destiny?.assetId, issuerId: this.destiny?.issuerId };
    const buying: CryptoCurrency =
      { currency: this.origin?.currency, assetId: this.origin?.assetId, issuerId: this.origin?.issuerId };
    
    this.origin = selling;
    this.destiny = buying;
  }

  async exchange() {
    if( !this.checkErrors() )
      return;

    if( !this.kycVerified ) {
      this.openPrevKYC();
      return;
    }
    
    if( await this.twoFASvc.verify() )
      this.modalController.dismiss({ origin: this.origin, destiny: this.destiny });
  }

  checkErrors(): boolean {
    const { num_sell, num_buy } = this.form.value;

    if( !this.origin?.currency ) {
      this.toastSvc.show( 'pages.wallet.error.missing-origin', true );
      return false;
    }

    if( !this.destiny?.currency ) {
      this.toastSvc.show( 'pages.wallet.error.missing-destiny', true );
      return false;
    }

    if( !num_sell || Number( num_sell ) <= 0 ) {
      this.toastSvc.show( 'pages.wallet.error.qOffer', true );
      return false;
    }
    
    if( !num_buy || Number( num_buy ) <= 0 ) {
       this.toastSvc.show( 'pages.wallet.error.qDemand', true );
      return false;
    }

    if( !this.hasThatAmount( num_sell ))
      return false;

    this.origin.amount = Number( num_sell );
    this.destiny.amount = Number( num_buy );

    return true;
  }

  hasThatAmount( amount: number ): boolean {
    for( let i = 0; i < this.userWallets?.length; i++ ) {
      const asset = this.userWallets[ i ];
      if( asset?.currency === this.origin?.currency ) {
        let retained: number = 0;
        
        // Substract the retained assets amount
        switch( asset?.currency ) {
          case CryptoCurrencyType.aureo:
            this.retainedTks?.forEach( tk => retained += Number( tk?.num_tokens || '0' ));
            break;
        }

        if( asset.amount - retained >= amount )
          return true;
      }
    }

    this.toastSvc.show( 'pages.wallet.error.exceeded', true );
    return false;
  }

  openPrevKYC() {
    const lang = 'kyc.alert.complete.';
    this.alertSvc.show({
      title: lang + 'head',
      msg: lang + 'msg',
      btns: [
        {
          text: 'common.buttons.got-it',
          handler: () => this.openKYC()
        }
      ]
    }, true);
  }

  async openKYC() {
    const popover = await this.popCtrl.create({
      component: KYCAliceComponent,
      translucent: true,
      mode: 'md',
      cssClass: 'pop-yt',
      backdropDismiss: false // To prevent user cancel on touch outside by error
    });

    await popover.present();

    // The data always returns `data.result`
    const { data } = await popover.onDidDismiss();

    // According to `isValidated` == true => perform the needed task
    if( data.result.isValidated ) {
      this.kycVerified = true;
      this.exchange();
    } else
      this.toastSvc.show(`kyc.${ data.result.isValidated ? '' : 'un' }verified`, true );
  }


  qantChange( input, isSell: boolean ) {
    const value = Number.parseFloat( input.value || '1' );
    if( this.exchangeType != ExchangeType.BUY )
      return;

    const priceSell = Number.parseFloat( this.offer?.amount );
    const priceBuy = this.offerSvc.calcBuy( this.offer?.amount, this.offer?.price, this.assetsMaxDecimals );

    this.checkQantExceeded( input, isSell ? priceBuy : priceSell, isSell )

    // Update opposite input
    const key = isSell ? 'num_buy' : 'num_sell';
    const opposite = ( isSell ? priceSell / priceBuy : priceBuy / priceSell ) * ( input?.value || 1 );
    this.form.patchValue({ [key] : opposite?.toFixed( this.assetsMaxDecimals ) });
  }

  checkQantExceeded( input, qant: number, isSell: boolean ) {
    if( Number.parseFloat( input.value || '0' ) > qant ) {
      input.value = qant;
      this.toastSvc.show( 'pages.wallet.exchange.exceeds-' + ( isSell ? 'sell' : 'buy' ), true );
    }
  }
}
