import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SharedPostModule } from '../posts/shared-post.module';

import { PerfilDemandantePageRoutingModule } from './perfil-demandante-routing.module';

import { PerfilDemandantePage } from './perfil-demandante.page';

@NgModule({
  imports: [
      SharedModule
    , PerfilDemandantePageRoutingModule
    , SharedPostModule
  ],
  declarations: [PerfilDemandantePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PerfilDemandantePageModule {}
