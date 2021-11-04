import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailVerifiedPage } from './email-verified.page';

const routes: Routes = [
  {
    path: '',
    component: EmailVerifiedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailVerifiedPageRoutingModule {}
