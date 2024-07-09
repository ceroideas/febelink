import {  NgModule } from '@angular/core';


import { LoBuscamosPorTiPage } from './lo-buscamos-por-ti.page';
import { SharedModule } from '../../shared/shared.module';

import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: LoBuscamosPorTiPage
  }
];



@NgModule({
  imports: [
    // RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [LoBuscamosPorTiPage],
  exports: [RouterModule],

})
export class LoBuscamosPorTiPageModule {}

