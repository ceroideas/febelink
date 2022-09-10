import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilOraculoPage } from './perfil-oraculo.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilOraculoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilOraculoPageRoutingModule {}
