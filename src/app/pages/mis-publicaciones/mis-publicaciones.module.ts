import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SharedPostModule } from '../posts/shared-post.module';

import { IonicModule } from '@ionic/angular';

import { MisPublicacionesPageRoutingModule } from './mis-publicaciones-routing.module';

import { MisPublicacionesPage } from './mis-publicaciones.page';
import { PostComponentsModule } from '../posts/components/components.module';

@NgModule({
  imports: [
    SharedModule
  , SharedPostModule
  ,  IonicModule,
    MisPublicacionesPageRoutingModule,
    PostComponentsModule,
  ],
  declarations: [MisPublicacionesPage]
})
export class MisPublicacionesPageModule {}
