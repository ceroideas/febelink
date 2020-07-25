import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleDemandaPage } from './detalle-demanda.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleDemandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleDemandaPageRoutingModule {}
