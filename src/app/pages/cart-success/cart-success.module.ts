import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartSuccessPageRoutingModule } from './cart-success-routing.module';

import { CartSuccessPage } from './cart-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartSuccessPageRoutingModule
  ],
  declarations: [CartSuccessPage]
})
export class CartSuccessPageModule {}
