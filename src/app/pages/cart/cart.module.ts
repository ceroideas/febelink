import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';


import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';

@NgModule({
  imports: [
    SharedModule,
    CartPageRoutingModule
  ],
  declarations: [CartPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartPageModule {}
