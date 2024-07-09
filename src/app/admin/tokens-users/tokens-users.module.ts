import { NgModule } from '@angular/core';


import { TokensUsersPageRoutingModule } from './tokens-users-routing.module';

import { TokensUsersPage } from './tokens-users.page';
import { EditTokensComponent } from './edit-tokens/edit-tokens.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    TokensUsersPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    TokensUsersPage,
    EditTokensComponent
  ]
})
export class TokensUsersPageModule {}
