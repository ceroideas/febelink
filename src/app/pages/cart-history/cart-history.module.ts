import { NgModule } from '@angular/core';


import { CartHistoryPageRoutingModule } from './cart-history-routing.module';

import { CartHistoryPage } from './cart-history.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CartHistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [CartHistoryPage]
})
export class CartHistoryPageModule {}
