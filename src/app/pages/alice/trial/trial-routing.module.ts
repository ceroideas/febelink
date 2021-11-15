import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrialPage } from './trial.page';

const routes: Routes = [
  {
    path: '',
    component: TrialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialPageRoutingModule {}
