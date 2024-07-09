import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SectorPage} from './sector/sector.page';
import {SubSectorPage} from './subsector/subsector.page';
import {LocationPage} from './location/location.page';
import {LinkLocationPage} from './link-location/link-location.page';
import { CityPage } from './city/city.page';
import { LinkCityPage } from './link-city/link-city.page';
import { LinkFooterPage } from './link-footer/link-footer.page';
import { ClicksPage } from './clicks/clicks.page';

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
  },
  {
    path: 'city',
    component: CityPage
  }, 
  {
    path: 'link-city',
    component: LinkCityPage
  },
  {
    path: 'link-footer',
    component: LinkFooterPage
  },
  {
    path: 'clicks',
    component: ClicksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordPageRoutingModule {
}
