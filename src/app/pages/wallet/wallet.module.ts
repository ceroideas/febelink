import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { ExchangeComponent } from './exchange/exchange.component';
import { SelectAssetComponent } from './select-asset/select-asset.component';
import { SharedModule } from 'src/app/shared/shared.module';

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
],
})
export class WalletPageModule {}
