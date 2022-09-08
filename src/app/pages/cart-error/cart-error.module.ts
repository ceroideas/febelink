import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartErrorPageRoutingModule } from './cart-error-routing.module';

import { CartErrorPage } from './cart-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartErrorPageRoutingModule
  ],
  declarations: [CartErrorPage]
})
export class CartErrorPageModule {}
