import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarDemandaPage } from './editar-demanda.page';

const routes: Routes = [
  {
    path: '',
    component: EditarDemandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarDemandaPageRoutingModule {}
