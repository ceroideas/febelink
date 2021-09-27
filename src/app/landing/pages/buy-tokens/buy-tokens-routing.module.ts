import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyTokensPage } from './buy-tokens.page';

const routes: Routes = [
  {
    path: '',
    component: BuyTokensPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyTokensPageRoutingModule {}
