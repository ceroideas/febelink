import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Index1Component } from './index1/index1.component';

const routes: Routes = [
  {
      path: '',
      component: Index1Component
  },
  // {
  //   path: 'checkout',
  //   loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  // },
  {
    path: 'success',
    loadChildren: () => import('./success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'buy',
    loadChildren: () => import('./buy-tokens/buy-tokens.module').then( m => m.BuyTokensPageModule)
  }


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
