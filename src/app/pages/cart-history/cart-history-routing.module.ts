import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartHistoryPage } from './cart-history.page';

const routes: Routes = [
  {
    path: '',
    component: CartHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartHistoryPageRoutingModule {}
