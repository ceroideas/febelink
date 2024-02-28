import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DetalleBusquedaPageRoutingModule} from './detalle-busqueda-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {DetalleBusquedaPage} from './detalle-busqueda.page';
import {SwiperModule} from 'swiper/angular';
import {ComponentsModule} from '../../components/components.module';

import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleBusquedaPageRoutingModule,
    SharedModule,
    SwiperModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [DetalleBusquedaPage]
})
export class DetalleBusquedaPageModule {
}
