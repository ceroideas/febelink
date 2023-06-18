import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterestingLinksPage } from './links.page';

const routes: Routes = [
  {
    path: '',
    component: InterestingLinksPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterestingLinksRoutingModule {}
