import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidarContrasenaPageRoutingModule } from './olvidar-contrasena-routing.module';

import { OlvidarContrasenaPage } from './olvidar-contrasena.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OlvidarContrasenaPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule,
    SharedModule,
  ],
  declarations: [OlvidarContrasenaPage],
  exports: [ TranslateModule ],
})
export class OlvidarContrasenaPageModule {}
