import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicarOpinionPage } from './publicar-opinion.page';

const routes: Routes = [
  {
    path: '',
    component: PublicarOpinionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicarOpinionPageRoutingModule {}
