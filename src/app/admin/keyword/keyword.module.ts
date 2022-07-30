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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeywordPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [
    SectorPage,
    SubSectorPage,
    SectorPipe,
    SubSectorPipe
  ],
  exports: [SectorPipe, SubSectorPipe]
})
export class KeywordPageModule {
}
