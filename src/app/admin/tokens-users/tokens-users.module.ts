import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TokensUsersPageRoutingModule } from './tokens-users-routing.module';

import { TokensUsersPage } from './tokens-users.page';
import { EditTokensComponent } from './edit-tokens/edit-tokens.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TokensUsersPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [
    TokensUsersPage,
    EditTokensComponent
  ]
})
export class TokensUsersPageModule {}
