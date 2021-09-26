import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyTokensPageRoutingModule } from './buy-tokens-routing.module';

import { BuyTokensPage } from './buy-tokens.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyTokensPageRoutingModule,
    SharedModule
  ],
  declarations: [BuyTokensPage]
})
export class BuyTokensPageModule {}
