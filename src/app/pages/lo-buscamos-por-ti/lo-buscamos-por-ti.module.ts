import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoBuscamosPorTiPageRoutingModule } from './lo-buscamos-por-ti-routing.module';

import { LoBuscamosPorTiPage } from './lo-buscamos-por-ti.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoBuscamosPorTiPageRoutingModule
  ],
  declarations: [LoBuscamosPorTiPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoBuscamosPorTiPageModule {}

