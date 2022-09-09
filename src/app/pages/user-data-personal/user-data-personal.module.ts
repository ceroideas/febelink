import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDataPersonalPageRoutingModule } from './user-data-personal-routing.module';

import { UserDataPersonalPage } from './user-data-personal.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    UserDataPersonalPageRoutingModule
  ],
  declarations: [UserDataPersonalPage]
})
export class UserDataPersonalPageModule {}
