import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CryptoCurrency, CryptoCurrencyType } from 'src/app/models/wallet/currency.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { KYCAliceComponent } from 'src/app/components/kyc-alice/kyc-alice.component';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { ExchangeType } from 'src/app/services/wallet/exchange.service';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { TwoFAService } from 'src/app/services/two_fa.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {

  @Input() origin: CryptoCurrency = {};
  @Input() destiny: CryptoCurrency = {};
  @Input() minnersFee: string = '0.000002';
  @Input() kycVerified: boolean = true;
  @Input() exchangeType: ExchangeType = ExchangeType.CREATE;
  
  @Input() userWallets: CryptoCurrency[] = [];
  @Input() retainedTks: TokensUser[];

  public exchangeForm: FormGroup;

  constructor(
      private modalController: ModalController
    , private formBuilder: FormBuilder
    , private popCtrl: PopoverController
    , private translateSvc: TranslateConfigService
    , private utilities: UtilitiesService
    , private assetSvc: AssetService
    , private twoFASvc: TwoFAService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ionViewDidLeave() {
    this.exchangeForm.reset();
  }

  buildForm() {
    this.exchangeForm = this.formBuilder.group({
      num_origin: new FormControl(( this.origin?.amount ), [ Validators.required ]),
      num_destiny: new FormControl(( this.destiny?.amount ), [ Validators.required ])
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
    const origin: CryptoCurrency = { currency: this.destiny?.currency };
    const destiny: CryptoCurrency = { currency: this.origin?.currency };
    
    this.origin = origin;
    this.destiny = destiny;
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
    const { num_origin, num_destiny } = this.exchangeForm.value;

    if( !this.origin?.currency ) {
      this.utilities.showToast( this.translateSvc.instant( 'pages.wallet.error.missing-origin' ));
      return false;
    }

    if( !this.destiny?.currency ) {
      this.utilities.showToast( this.translateSvc.instant( 'pages.wallet.error.missing-destiny' ));
      return false;
    }

    if( !num_origin || Number( num_origin ) <= 0 ) {
      this.utilities.showToast( this.translateSvc.instant( 'pages.wallet.error.qOffer' ));
      return false;
    }
    
    if( !num_destiny || Number( num_destiny ) <= 0 ) {
       this.utilities.showToast( this.translateSvc.instant( 'pages.wallet.error.qDemand' ));
      return false;
    }

    if( !this.hasThatAmount( num_origin ))
      return false;

    this.origin.amount = Number( num_origin );
    this.destiny.amount = Number( num_destiny );

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

    this.utilities.showToast( this.translateSvc.instant( 'pages.wallet.error.exceeded' ));
    return false;
  }

  async openPrevKYC() {
    const lang = 'kyc.alert.complete.';
    const alert = await this.utilities.alertCtrl.create({
      header: this.translateSvc.instant( lang + 'head' ),
      message: this.translateSvc.instant( lang + 'msg' ),
      buttons: [
        {
          text: this.translateSvc.instant( 'common.buttons.got-it' ),
          handler: () => this.openKYC()
        }
      ]
    });

    await alert.present();
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
      this.utilities.showToast(
        this.translateSvc.instant( `kyc.${ data.result.isValidated ? '' : 'un' }verified` )
      );
  }
}
