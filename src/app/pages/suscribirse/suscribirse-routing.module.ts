import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuscribirsePage } from './suscribirse.page';

const routes: Routes = [
  {
    path: '',
    component: SuscribirsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuscribirsePageRoutingModule {}
