import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilDemandantePage } from './perfil-demandante.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilDemandantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilDemandantePageRoutingModule {}
