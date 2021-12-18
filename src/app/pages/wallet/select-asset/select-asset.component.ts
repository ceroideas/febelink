import { Component, Input, OnInit } from '@angular/core';
import * as Currency from 'src/app/models/currency.model';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-asset',
  templateUrl: './select-asset.component.html',
  styleUrls: ['./select-asset.component.scss'],
})
export class SelectAssetComponent implements OnInit {

  assetTypes = Currency.AssetTypes;
  @Input() except: Currency.CryptoCurrencyType;

  constructor(
      private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  onAssetSelected( asset: Currency.CryptoCurrency ) {
    this.popoverController.dismiss({ asset });
  }
}
