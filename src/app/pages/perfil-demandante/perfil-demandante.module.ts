import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FollowerButtonModule } from 'src/app/components/follower/follower.module';
import { DonateButtonModule } from 'src/app/components/donate/donate-button.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedPostModule } from '../posts/shared-post.module';

import { PerfilDemandantePageRoutingModule } from './perfil-demandante-routing.module';

import { PerfilDemandantePage } from './perfil-demandante.page';

@NgModule({
  imports: [
      SharedModule
    , PerfilDemandantePageRoutingModule
    , SharedPostModule
    , FollowerButtonModule
    , DonateButtonModule
  ],
  declarations: [PerfilDemandantePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PerfilDemandantePageModule {}
