import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartHistoryPageRoutingModule } from './cart-history-routing.module';

import { CartHistoryPage } from './cart-history.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartHistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [CartHistoryPage]
})
export class CartHistoryPageModule {}
