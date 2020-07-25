import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfertantesPage } from './ofertantes.page';

const routes: Routes = [
  {
    path: '',
    component: OfertantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfertantesPageRoutingModule {}
