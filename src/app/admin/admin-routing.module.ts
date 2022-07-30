import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AdminPage} from './admin.page';
import {KeywordPageModule} from './keyword/keyword.module';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'tokens-users',
    loadChildren: () => import('./tokens-users/tokens-users.module').then(m => m.TokensUsersPageModule)
  }, {
    path: 'keyword',
    loadChildren: () => import('./keyword/keyword.module').then(m => m.KeywordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {
}
