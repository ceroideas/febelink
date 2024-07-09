import {  NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
// import { SharedPostModule } from '../posts/shared-post.module';


import { SuscripcionesPageRoutingModule } from './suscripciones-routing.module';

import { SuscripcionesPage } from './suscripciones.page';

@NgModule({
  imports: [
    SharedModule,
  // , SharedPostModule,
    SuscripcionesPageRoutingModule
  ],
  declarations: [SuscripcionesPage],
})
export class SuscripcionesPageModule {}
