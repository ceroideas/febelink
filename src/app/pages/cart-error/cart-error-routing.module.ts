import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartErrorPage } from './cart-error.page';

const routes: Routes = [
  {
    path: '',
    component: CartErrorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartErrorPageRoutingModule {}
