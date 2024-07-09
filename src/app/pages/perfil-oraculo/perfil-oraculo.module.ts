import {  NgModule } from '@angular/core';
// import { FollowerButtonModule } from './../../components/follower/follower.module';
// import { DonateButtonModule } from './../../components/donate/donate-button.module';
import { SharedModule } from '../../shared/shared.module';
// import { SharedPostModule } from '../posts/shared-post.module';


import { PerfilOraculoPageRoutingModule } from './perfil-oraculo-routing.module';

import { PerfilOraculoPage } from './perfil-oraculo.page';
// import { PostComponentsModule } from '../posts/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    // SharedPostModule,
    // FollowerButtonModule,
    // DonateButtonModule,
    PerfilOraculoPageRoutingModule,
    // PostComponentsModule,
  ],
  declarations: [PerfilOraculoPage],
  providers: [ ]
})
export class PerfilOraculoPageModule {}
