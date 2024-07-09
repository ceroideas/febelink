import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalDisclaimerPage } from './legal-disclaimer.page';

const routes: Routes = [
  {
    path: '',
    component: LegalDisclaimerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalDisclaimerPageRoutingModule {}
