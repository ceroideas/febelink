import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Offer } from 'src/app/models/wallet/offers.models';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { DateFormatType, MonthFormatType } from 'src/app/pipes/date-format.pipe';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AssetService } from 'src/app/services/wallet/asset.service';
import { ExchangeService, ExchangeType } from 'src/app/services/wallet/exchange.service';
import { OfferService } from 'src/app/services/wallet/offer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {

  @Input() offer: Offer;
  @Input() isSelling: boolean;
  @Input() walletParams: WalletParams;
  @Output() OnChange: EventEmitter<ExchangeType> = new EventEmitter()

  dateFormatType = DateFormatType;
  monthFormatType = MonthFormatType;
  
  constructor(
      private utils: UtilitiesService
    , private translateSvc: TranslateConfigService
    , private offerSvc: OfferService
    , public assetSvc: AssetService
    , private exchangeSvc: ExchangeService
  ) {}

  ngOnInit() {}
  
  async buy() {
    const response = await this.exchangeSvc.show(
      ExchangeType.BUY, this.walletParams, { offer: this.offer }
    );
    console.log( 'response: ', response );
    this.OnChange.emit( ExchangeType.EDIT );
  }

  async edit() {
    const response = await this.exchangeSvc.show(
      ExchangeType.EDIT, this.walletParams, { offer: this.offer }
    );
    console.log( 'response: ', response );
    this.OnChange.emit( ExchangeType.EDIT );
  }

  async delete() {
    this.utils.showAlert(
      this.translateSvc.instant( 'pages.wallet.offers.delete.title' ),
      this.translateSvc.instant( 'pages.wallet.offers.delete.message' ),
      '',
      [
          // Cancel
        { text: this.translateSvc.instant( 'common.buttons.cancel' ), role: 'cancel' },
        { // Continue
          text: this.translateSvc.instant( 'common.buttons.continue' ),
          handler: () => this.doDelete(),
        },
      ]
    );
  }
  private async doDelete( ) {
    await this.utils.showLoading();
    this.offerSvc.delete( this.offer ).then(
      (response) => {
        console.log( 'response: ', response );
        this.utils.showToast( this.translateSvc.instant( 'pages.wallet.offers.delete.success' ));
        this.utils.dismissLoading();
        this.OnChange.emit( ExchangeType.DELETE );
      },
      (err) => {
        console.log( 'error: ', err );
        this.utils.dismissLoading();
        this.utils.showAlert(
          this.translateSvc.instant( 'pages.wallet.offers.delete.title' ),
          this.translateSvc.instant( 'pages.wallet.offers.delete.error' ) + err.message
        );
      }
    );
  }
}
