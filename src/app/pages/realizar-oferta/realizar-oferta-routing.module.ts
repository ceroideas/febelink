import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RealizarOfertaPage } from './realizar-oferta.page';

const routes: Routes = [
  {
    path: '',
    component: RealizarOfertaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealizarOfertaPageRoutingModule {}
