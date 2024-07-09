import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePasswordPageRoutingModule } from './update-password-routing.module';

import { UpdatePasswordPage } from './update-password.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UpdatePasswordPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UpdatePasswordPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  exports: [TranslateModule],
})
export class UpdatePasswordPageModule {}
