import { Component, Input, OnInit } from '@angular/core';
import * as Currency from 'src/app/models/wallet/currency.model';
import { PopoverController } from '@ionic/angular';
import { ToastSvc } from 'src/app/services/toast.service';

@Component({
  selector: 'app-select-asset',
  templateUrl: './select-asset.component.html',
  styleUrls: ['./select-asset.component.scss'],
})
export class SelectAssetComponent implements OnInit {

  @Input() except: Currency.CryptoCurrencyType;
  @Input() assetTypes: Currency.CryptoCurrency[] = Currency.AssetTypes;

  constructor(
      private popoverController: PopoverController
    , private toastSvc: ToastSvc
  ) {}

  ngOnInit() {}

  onAssetSelected( asset: Currency.CryptoCurrency ) {
    if( !asset.assetId ) {
      this.toastSvc.show( 'pages.wallet.error.asset-not-available', true );
      return;
    }

    this.popoverController.dismiss({ asset });
  }
}
