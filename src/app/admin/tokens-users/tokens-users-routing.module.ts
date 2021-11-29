import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TokensUsersPage } from './tokens-users.page';

const routes: Routes = [
  {
    path: '',
    component: TokensUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokensUsersPageRoutingModule {}
