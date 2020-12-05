import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuscriptionBrowserPage } from './suscription-browser.page';

const routes: Routes = [
  {
    path: '',
    component: SuscriptionBrowserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuscriptionBrowserPageRoutingModule {}
