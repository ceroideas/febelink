import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UseConditionsPage } from './use-conditions.page';

const routes: Routes = [
  {
    path: '',
    component: UseConditionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseConditionsPageRoutingModule {}
