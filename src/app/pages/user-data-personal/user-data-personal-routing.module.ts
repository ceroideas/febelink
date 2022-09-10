import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDataPersonalPage } from './user-data-personal.page';

const routes: Routes = [
  {
    path: '',
    component: UserDataPersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDataPersonalPageRoutingModule {}
