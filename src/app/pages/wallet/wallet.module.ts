import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { ExchangeComponent } from './exchange/exchange.component';

@NgModule({
  imports: [
      CommonModule
    , FormsModule
    , ReactiveFormsModule 
    , IonicModule
    , WalletPageRoutingModule
  ],
  declarations: [
      WalletPage
    , ExchangeComponent
],
})
export class WalletPageModule {}
