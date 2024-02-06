import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SectorPage} from './sector/sector.page';
import {SubSectorPage} from './subsector/subsector.page';
import {LocationPage} from './location/location.page';
import {LinkLocationPage} from './link-location/link-location.page';

const routes: Routes = [
  {
    path: 'sector',
    component: SectorPage
  }, {
    path: 'sub-sector',
    component: SubSectorPage
  }, 
  {
    path: 'location',
    component: LocationPage
  }, 
  {
    path: 'link-location',
    component: LinkLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordPageRoutingModule {
}
