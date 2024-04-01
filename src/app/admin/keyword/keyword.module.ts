import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {KeywordPageRoutingModule} from './keyword-routing.module';

import {SectorPage} from './sector/sector.page';

import {SharedModule} from 'src/app/shared/shared.module';
import {ComponentsModule} from 'src/app/components/components.module';
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
    CommonModule,
    FormsModule,
    IonicModule,
    KeywordPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [
    SectorPage,
    SubSectorPage,
    LocationPage,
    CityPage,
    LinkFooterPage,
    LinkCityPage,
    LinkLocationPage,
    ClicksPage,
    SectorPipe,
    SubSectorPipe
  ],
  exports: [SectorPipe, SubSectorPipe]
})
export class KeywordPageModule {
}
