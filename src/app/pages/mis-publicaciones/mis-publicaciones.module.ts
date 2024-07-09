import {  NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';


import { MisPublicacionesPageRoutingModule } from './mis-publicaciones-routing.module';

import { MisPublicacionesPage } from './mis-publicaciones.page';

@NgModule({
  imports: [
    SharedModule,
    MisPublicacionesPageRoutingModule,
  ],
  declarations: [MisPublicacionesPage]
})
export class MisPublicacionesPageModule {}
