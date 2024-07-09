import { AlertSvc } from './../../../services/alert.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CryptoCurrency } from '../../../models/wallet/currency.model';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AssetService } from '../../../services/wallet/asset.service';
import { TwoFAService } from '../../../services/two_fa.service';
import { MarketPrice, Offer } from '../../../models/wallet/offers.models';
import { ExchangeInput, ExchangeType } from '../../../models/wallet/exchange.model';
import { OfferService } from '../../../services/wallet/offer.service';
import { ToastSvc } from '../../../services/toast.service';
// import { KycPopSvc } from '../../../services/kyc/kyc.pop.service';
import { DateFormatType } from '../../../pipes/date-format.pipe';
import { ExchangeInputSvc } from '../../../services/wallet/exchange.input.service';
import { CloneAssetSvc } from '../../../services/wallet/clone.assets.service';
import { ExchangeService } from '../../../services/wallet/exchange.service';
import { WalletParams } from '../../../models/wallet/params.model';
import { TkLimitSvc } from '../../../services/wallet/tk-limit.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit, OnChanges {


  @Input() offer: Offer | undefined;
  @Input() sell: CryptoCurrency = {};
  @Input() buy: CryptoCurrency = {};
  @Input() kycVerified: boolean = true;
  @Input() exchangeType: ExchangeType = ExchangeType.CREATE;
  
  @Input() walletParams: WalletParams = {}
  
  @Input() useMarketPrice: boolean = false;
  mktPrice: MarketPrice = { isLoading: true };

  @Output() OnDismiss: any
  @Output() OnDone: EventEmitter<Object> = new EventEmitter()
  
  public form: UntypedFormGroup | undefined;
  exchangeTypes = ExchangeType;
  exchangesInput = ExchangeInput;
  dateFormatType = DateFormatType;

  limitSell: number = 0;
  limitBuy: number= 0;

  constructor(
      private formBuilder: UntypedFormBuilder
    , private toastSvc: ToastSvc
    , public assetSvc: AssetService
    , private twoFASvc: TwoFAService
    , private offerSvc: OfferService
    , private exchangeInputSvc: ExchangeInputSvc
    // , private kycPopSvc: KycPopSvc
    , private cloneAssetSvc: CloneAssetSvc
    , private alertSvc: AlertSvc
    , private exchangeSvc: ExchangeService
    , private tkLimitSvc: TkLimitSvc
  ) {}

  ngOnInit() {
    this.setDefaults();
  }
  
  ngOnChanges( changes: SimpleChanges ) {
    this.setDefaults();
  }

  ionViewDidLeave() {
    this.form?.reset();
  }

  buildForm() {
    const isBuy = this.exchangeType == ExchangeType.BUY;

    this.form = this.formBuilder.group({
        num_sell_qant: new UntypedFormControl(
          ( this.sell?.amount == 0 ? '' : this.sell?.amount )
          , [ Validators.required ]
        )
        , num_buy_qant: new UntypedFormControl(
          ( this.buy?.amount == 0 ? '' : this.buy?.amount )
          , [ Validators.required ]
        )
    });
  }

  // If Creating Exchange, no default asset selected, so pick one by default
  setDefaults() {
    if( !this.walletParams ) return;
    
    this.exchangeSvc.setType( this.exchangeType )
    this.exchangeSvc.setParams( this.walletParams )

    if (this.offer) {
      this.cloneAssetSvc.set(this.exchangeType, this.offer, this.walletParams);
  }
    //@ts-ignore
    this.sell = this.cloneAssetSvc.get( this.sell, this.buy, true )
    //@ts-ignore

    this.buy = this.cloneAssetSvc.get( this.buy, this.sell, false )
    
    this.setLimits();
    this.buildForm();
  }

  setLimits() {
    //@ts-ignore

    this.limitSell = this.tkLimitSvc.qantAvailable( this.sell, this.walletParams )
    //@ts-ignore

    this.limitBuy = this.tkLimitSvc.qantAvailable( this.buy, this.walletParams )
    this.marketPrice()
  }

  dismiss( object? : any) {
    if( object?.saved ) {
      this.OnDone.emit( object )
      this.form?.reset()
    }

    if( this.OnDismiss )
      this.OnDismiss( object );
  }
  
  async selectAsset( event: any, isSelling: boolean ) {
    const asset = await this.assetSvc.select(
          event
          //@ts-ignore
        , this.walletParams.userWallets
        , !isSelling ? this.sell : this.buy
    );

    // Only do if asset selected
    if( !asset )
      return;

    if( isSelling )
      this.sell.currency = asset.currency;
    else
      this.buy.currency = asset.currency;

    this.setLimits();
  }

  switchAssets() {
    if( this.exchangeType == ExchangeType.BUY ) {
      this.toastSvc.show( 'pages.wallet.exchange.cant-switch', true );
      return;
    }

    const selling: CryptoCurrency =
      { currency: this.buy?.currency, assetId: this.buy?.assetId, issuerId: this.buy?.issuerId };
    const buying: CryptoCurrency =
      { currency: this.sell?.currency, assetId: this.sell?.assetId, issuerId: this.sell?.issuerId };
    
    this.sell = selling;
    this.buy = buying;
    this.setLimits()
  }

  async exchange() {
    if( !this.checkErrors() )
      return;

    // if( !this.kycVerified ) {
    //   if( !await this.kycPopSvc.preVerify() )
    //     return;

    //   this.kycVerified = true;
    // }
    
    if( await this.twoFASvc.verify() )
      this.OnDo({ sell: this.sell, buy: this.buy });
  }

  checkErrors(): boolean {
    const { num_sell_qant, num_buy_qant } = this.form?.value;

    if( !this.sell?.currency ) {
      this.toastSvc.show( 'pages.wallet.error.missing-sell', true );
      return false;
    }

    if( !this.buy?.currency ) {
      this.toastSvc.show( 'pages.wallet.error.missing-buy', true );
      return false;
    }

    if( !num_sell_qant || Number( num_sell_qant ) <= 0 ) {
      this.toastSvc.show( 'pages.wallet.error.sell_qant', true );
      return false;
    }
    
    if( !num_buy_qant || Number( num_buy_qant ) <= 0 ) {
       this.toastSvc.show( 'pages.wallet.error.buy_qant', true );
      return false;
    }

    if( !this.hasThatAmount( num_sell_qant ))
      return false;

    this.sell.amount = Number( num_sell_qant );
    this.buy.amount = Number( num_buy_qant );

    return true;
  }

  hasThatAmount( amount: number ): boolean {
    if( !this.tkLimitSvc.exceeds( amount, this.sell, this.walletParams ))
      return true;

    this.toastSvc.show( 'pages.wallet.error.exceeded', true );
    return false;
  }

  async marketPrice() {
    if( this.exchangeType == ExchangeType.BUY || !this.sell?.currency || !this.buy?.currency ) return

    this.mktPrice.isLoading = true;
    const { response, error } = await this.offerSvc.marketPrice( this.sell, this.buy )
    
    this.mktPrice = {
      isLoading: false

      , selling: response?.selling
      , sellingIssuerId: response?.sellingIssuerId
      , price_selling: response?.price_selling
      
      , buying: response?.buying
      , buyingIssuerId: response?.buyingIssuerId
      , price_buying: response?.price_buying
    }

    /* if( !error )
      this.OnMarketPriceChecked( this.useMarketPrice ) */
  }

  OnMarketPriceChecked()
  {
    if( this.useMarketPrice )   
      this.qantChange()
  }
  calcBuy(): number {
    //@ts-ignore
    return this.offerSvc.calcBuy( this.offer?.amount, this.offer?.price, this.walletParams.assetsMaxDecimals )
  }
  qantChange( exchangeInput: ExchangeInput = ExchangeInput.SELL_CONV ) {
    const isBuy = this.exchangeType == ExchangeType.BUY;
    // Do calculations only if can't alter conversion => using Market Price or isBuy
    if( !this.useMarketPrice && !isBuy ) return

    const { num_sell_qant, num_buy_qant } = this.form?.getRawValue();
    
    const maxSell = !isBuy
      ? undefined
       //@ts-ignore
      : this.offerSvc.calcBuy( this.offer?.amount, this.offer?.price, this.walletParams.assetsMaxDecimals )
    
    const maxBuy = !isBuy
      ? undefined
      //@ts-ignore
      : Number.parseFloat( this.offer?.amount )

      this.exchangeInputSvc.calc({
        sell_qant: num_sell_qant,
        sell_conv: this.getConversion(),
        buy_qant: num_buy_qant,
        buy_conv: this.getConversion(false),
        is: exchangeInput,
        maxDecimals: this.walletParams.assetsMaxDecimals ?? 0, // Provide a default value of 0 if assetsMaxDecimals is undefined
        maxSell: maxSell,
        maxBuy: maxBuy
        //@ts-ignore
    }, this.form);
  }

  getConversion( isSelling: boolean = true, sell?: number | string, buy?: number | string ): number {
    const isBuy = this.exchangeType == ExchangeType.BUY
     //@ts-ignore
    if( !this.useMarketPrice && !isBuy ) return isSelling ? 1 : +sell / +buy
 //@ts-ignore
    return isSelling ?
     //@ts-ignore
      ( !isBuy ? this.mktPrice?.price_selling : +this.offer?.price )
      :( isBuy ? 1 : this.mktPrice?.price_buying )
  }

  async delete() {
    this.alertSvc.show({
      title: 'pages.wallet.offers.delete.title',
      msg: 'pages.wallet.offers.delete.message',
      btns: [
          // Cancel
        { text: 'common.buttons.cancel', role: 'cancel' },
        { // Continue
          text: 'common.buttons.continue',
          handler: () => this.OnDo({ delete: true }),
        },
      ]
    }, true );
  }

  private async OnDo( data: any ) {
     //@ts-ignore
    const { saved, response, error } = await this.exchangeSvc.OnDone( data, this.offer );

    if( !error )
      this.dismiss({ saved, response, error });
  }
}
