import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FollowerButtonModule } from 'src/app/components/follower/follower.module';
import { DonateButtonModule } from 'src/app/components/donate/donate-button.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedPostModule } from '../posts/shared-post.module';

import { IonicModule } from '@ionic/angular';

import { PerfilOraculoPageRoutingModule } from './perfil-oraculo-routing.module';

import { PerfilOraculoPage } from './perfil-oraculo.page';

@NgModule({
  imports: [
    SharedModule
  , SharedPostModule
  , FollowerButtonModule
  , DonateButtonModule
  , PerfilOraculoPageRoutingModule
  ],
  declarations: [PerfilOraculoPage]
})
export class PerfilOraculoPageModule {}
