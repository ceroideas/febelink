import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Index1Component } from './index1/index1.component';

const routes: Routes = [
  {
      path: '',
      component: Index1Component
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
