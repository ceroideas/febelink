import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePasswordPageRoutingModule } from './update-password-routing.module';

import { UpdatePasswordPage } from './update-password.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UpdatePasswordPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpdatePasswordPageRoutingModule,
    ComponentsModule,
    TranslateModule.forChild(),
    SharedModule,
  ],
  exports: [TranslateModule],
})
export class UpdatePasswordPageModule {}
