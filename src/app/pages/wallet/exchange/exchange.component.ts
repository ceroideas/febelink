import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/currency.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectAssetComponent } from '../select-asset/select-asset.component';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TwoFAComponent } from 'src/app/components/two-fa/two-fa.component';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {

  @Input() origin: CryptoCurrency = {};
  @Input() destiny: CryptoCurrency = {};
  @Input() minnersFee: string = '0.000002 FLAU = $ 0.0447';

  public exchangeForm: FormGroup;

  constructor(
      private modalController: ModalController
    , private formBuilder: FormBuilder
    , private popCtrl: PopoverController
    , private translateSvc: TranslateConfigService
    , private utilities: UtilitiesService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ionViewDidLeave() {
    this.exchangeForm.reset();
  }

  buildForm() {
    this.exchangeForm = this.formBuilder.group({
      num_origin: new FormControl(( '' ), [ Validators.required ]),
      num_destiny: new FormControl(( '' ), [ Validators.required ])
    });
  }

  onDismiss( ) {
    this.modalController.dismiss({ });
  }
  
  async selectAsset( isOrigin: boolean ) {
    event.stopPropagation();
    const popover = await this.popCtrl.create({
      component: SelectAssetComponent,
      translucent: true,
      mode: 'md',
      componentProps: { except: !isOrigin ? this.origin.currency : this.destiny.currency }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    // Only do if asset selected
    if( !data?.asset )
      return;

    // Assign asset to corresponding card
    const asset = data.asset as CryptoCurrency;

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

    /* Verify 2FA */
    const verified = await this.verify2FA();
    
    if( verified )
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

    this.origin.ammount = Number( num_origin );
    this.destiny.ammount = Number( num_destiny );

    return true;
  }

  /* Verify 2FA PopoverControll */
  async verify2FA(): Promise<any> {
    const twoFApop = await this.popCtrl.create({
      component: TwoFAComponent,
      cssClass: 'pop-mobile-width',
    });
    await twoFApop.present();

    const { data } = await twoFApop.onDidDismiss();
    return new Promise( resolve => { resolve( data?.verified )});
  }
}
