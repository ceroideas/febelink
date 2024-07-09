import {NgModule} from '@angular/core';


import {KeywordPageRoutingModule} from './keyword-routing.module';

import {SectorPage} from './sector/sector.page';

import {SharedModule} from '../../shared/shared.module';
import {SectorPipe} from './pipes/sector.pipe';
import {SubSectorPage} from './subsector/subsector.page';
import {SubSectorPipe} from './pipes/subsector.pipe';
import { LocationPage } from './location/location.page';
import { LinkLocationPage } from './link-location/link-location.page';
import { CityPage } from './city/city.page';
import { LinkCityPage } from './link-city/link-city.page';
import { LinkFooterPage } from './link-footer/link-footer.page';
import { ClicksPage } from './clicks/clicks.page';
@NgModule({
  imports: [
    KeywordPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    SectorPage,
    SubSectorPage,
    LocationPage,
    CityPage,
    LinkFooterPage,
    LinkCityPage,
    LinkLocationPage,
    SectorPipe,
    SubSectorPipe,
    ClicksPage
  ],
  exports: [SectorPipe, SubSectorPipe]
})
export class KeywordPageModule {
}
