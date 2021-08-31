import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsLogPage } from './notifications-log.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsLogPageRoutingModule {}
