import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SharedPostModule } from '../posts/shared-post.module';

import { IonicModule } from '@ionic/angular';

import { SuscripcionesPageRoutingModule } from './suscripciones-routing.module';

import { SuscripcionesPage } from './suscripciones.page';

@NgModule({
  imports: [
    SharedModule
  , SharedPostModule,
    IonicModule,
    SuscripcionesPageRoutingModule
  ],
  declarations: [SuscripcionesPage]
})
export class SuscripcionesPageModule {}
