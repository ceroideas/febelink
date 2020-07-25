import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SesionCtrlPage } from './sesion-ctrl.page';

const routes: Routes = [
  {
    path: '',
    component: SesionCtrlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SesionCtrlPageRoutingModule {}
