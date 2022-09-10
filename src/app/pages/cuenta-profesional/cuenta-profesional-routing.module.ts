import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentaProfesionalPage } from './cuenta-profesional.page';

const routes: Routes = [
  {
    path: '',
    component: CuentaProfesionalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentaProfesionalPageRoutingModule {}
