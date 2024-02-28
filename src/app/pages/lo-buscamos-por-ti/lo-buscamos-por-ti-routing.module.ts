import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoBuscamosPorTiPage } from './lo-buscamos-por-ti.page';

const routes: Routes = [
  {
    path: '',
    component: LoBuscamosPorTiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoBuscamosPorTiPageRoutingModule {}
