import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicarDemandaPage } from './publicar-demanda.page';

const routes: Routes = [
  {
    path: '',
    component: PublicarDemandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicarDemandaPageRoutingModule {}
