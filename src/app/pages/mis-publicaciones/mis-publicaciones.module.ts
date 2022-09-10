import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SharedPostModule } from '../posts/shared-post.module';

import { IonicModule } from '@ionic/angular';

import { MisPublicacionesPageRoutingModule } from './mis-publicaciones-routing.module';

import { MisPublicacionesPage } from './mis-publicaciones.page';

@NgModule({
  imports: [
    SharedModule
  , SharedPostModule
  ,  IonicModule,
    MisPublicacionesPageRoutingModule
  ],
  declarations: [MisPublicacionesPage]
})
export class MisPublicacionesPageModule {}
