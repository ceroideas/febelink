import { Component, Input, OnInit } from '@angular/core';
import * as Currency from 'src/app/models/wallet/currency.model';
import { PopoverController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
    , private utilities: UtilitiesService
  ) {}

  ngOnInit() {}

  onAssetSelected( asset: Currency.CryptoCurrency ) {
    if( !asset.assetId ) {
      this.utilities.showToast( this.utilities.translateService.instant( 'pages.wallet.error.asset-not-available' ));
      return;
    }

    this.popoverController.dismiss({ asset });
  }
}
