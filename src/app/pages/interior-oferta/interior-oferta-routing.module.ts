import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteriorOfertaPage } from './interior-oferta.page';

const routes: Routes = [
  {
    path: '',
    component: InteriorOfertaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteriorOfertaPageRoutingModule {}
