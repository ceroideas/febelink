import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { ExchangeComponent } from './exchange/exchange.component';
import { SelectAssetComponent } from './select-asset/select-asset.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BuyAssetsComponent } from './buy-assets/buy-assets.component';
import { SendComponent } from './send/send.component';
import { BalanceComponent } from './balance/balance.component';

@NgModule({
  imports: [
      CommonModule
    , FormsModule
    , ReactiveFormsModule 
    , IonicModule
    , WalletPageRoutingModule
    , SharedModule
  ],
  declarations: [
      WalletPage
    , ExchangeComponent
    , SelectAssetComponent
    , BuyAssetsComponent
    , SendComponent
    , BalanceComponent
],
})
export class WalletPageModule {}
