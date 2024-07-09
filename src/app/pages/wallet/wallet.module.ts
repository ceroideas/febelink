import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { ExchangeComponent } from './exchange/exchange.component';
import { SelectAssetComponent } from './select-asset/select-asset.component';
import { BuyAssetsComponent } from './buy-assets/buy-assets.component';
import { SendComponent } from './send/send.component';
import { BalanceComponent } from './balance/balance.component';
import { OffersComponent } from './offers/offers.component';
import { OffersListComponent } from './offers-list/offers-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
     WalletPageRoutingModule
    , SharedModule
  ],
  declarations: [
      WalletPage
    , ExchangeComponent
    , SelectAssetComponent
    , BuyAssetsComponent
    , SendComponent
    , BalanceComponent
    , OffersComponent
    , OffersListComponent
],
})
export class WalletPageModule {}
