import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleBusquedaPageRoutingModule } from './detalle-busqueda-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DetalleBusquedaPage } from './detalle-busqueda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleBusquedaPageRoutingModule, 
    SharedModule
  ],
  declarations: [DetalleBusquedaPage]
})
export class DetalleBusquedaPageModule {}
