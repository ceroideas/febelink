import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleDemandaPageRoutingModule } from './detalle-demanda-routing.module';

import { DetalleDemandaPage } from './detalle-demanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleDemandaPageRoutingModule
  ],
  declarations: [DetalleDemandaPage]
})
export class DetalleDemandaPageModule {}
