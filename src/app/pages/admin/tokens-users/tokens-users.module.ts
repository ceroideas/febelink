import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TokensUsersPageRoutingModule } from './tokens-users-routing.module';

import { TokensUsersPage } from './tokens-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TokensUsersPageRoutingModule
  ],
  declarations: [TokensUsersPage]
})
export class TokensUsersPageModule {}
