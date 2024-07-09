import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DetalleBusquedaPageRoutingModule} from './detalle-busqueda-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DetalleBusquedaPage} from './detalle-busqueda.page';


@NgModule({
  imports: [
    CommonModule,
    DetalleBusquedaPageRoutingModule,
    SharedModule,
   
  ],
  declarations: [DetalleBusquedaPage]
})
export class DetalleBusquedaPageModule {
}
