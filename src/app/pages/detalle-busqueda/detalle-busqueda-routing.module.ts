import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleBusquedaPage } from './detalle-busqueda.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleBusquedaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleBusquedaPageRoutingModule {}
