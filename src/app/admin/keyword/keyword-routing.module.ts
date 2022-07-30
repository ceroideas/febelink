import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SectorPage} from './sector/sector.page';
import {SubSectorPage} from './subsector/subsector.page';

const routes: Routes = [
  {
    path: 'sector',
    component: SectorPage
  }, {
    path: 'sub-sector',
    component: SubSectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordPageRoutingModule {
}
