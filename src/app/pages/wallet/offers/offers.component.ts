import { ExchangePop } from './../../../services/wallet/exchange.pop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Offer } from './../../../models/wallet/offers.models';
import { WalletParams } from './../../../models/wallet/params.model';
import { DateFormatType, MonthFormatType } from './../../../pipes/date-format.pipe';
import { TranslateConfigService } from './../../../services/translate/translate-config.service';
import { AssetService } from './../../../services/wallet/asset.service';
import { OfferService } from './../../../services/wallet/offer.service';
import { ExchangeType } from './../../../models/wallet/exchange.model';
import { AlertSvc } from './../../../services/alert.service';
import { ToastSvc } from './../../../services/toast.service';
import { LoadingSvc } from './../../../services/loading.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {

  @Input() offer: Offer | any;
  @Input() isSelling: boolean = false;
  //@ts-ignore
  @Input() walletParams: WalletParams ;
  @Output() OnChange: EventEmitter<ExchangeType> = new EventEmitter()

  dateFormatType = DateFormatType;
  monthFormatType = MonthFormatType;
  
  constructor(
      private translateSvc: TranslateConfigService
    , public offerSvc: OfferService
    , public assetSvc: AssetService
    , private exchangePop: ExchangePop
    , private alertSvc: AlertSvc
    , private toastSvc: ToastSvc
    , private loadingSvc: LoadingSvc
  ) {}

  ngOnInit() {}
  
  async buy() {
    const { saved, response, error } = await this.exchangePop.show(
      ExchangeType.BUY, this.walletParams, { offer: this.offer }
    );

    if( saved && !error ) this.OnChange.emit( ExchangeType.BUY );
  }

  async edit() {
    const { saved, response, error } = await this.exchangePop.show(
      ExchangeType.EDIT, this.walletParams, { offer: this.offer }
    );
    
    if( saved && !error ) this.OnChange.emit( ExchangeType.EDIT );
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
          handler: () => this.doDelete(),
        },
      ]
    }, true );
  }
  private async doDelete( ) {
    await this.loadingSvc.show();
    const { response, error } = await this.offerSvc.delete( this.offer );

    if( error ) {
      await this.loadingSvc.dismiss();
      this.alertSvc.show({
        title: 'pages.wallet.offers.delete.title',
        message: this.translateSvc.instant( 'pages.wallet.offers.delete.error' ) + error.message
      }, true );
      return
    }
    
    this.toastSvc.show( 'pages.wallet.offers.delete.success', true );
    await this.loadingSvc.dismiss();
    this.OnChange.emit( ExchangeType.DELETE );
  }
}
