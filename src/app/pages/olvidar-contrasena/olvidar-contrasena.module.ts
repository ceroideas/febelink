import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidarContrasenaPageRoutingModule } from './olvidar-contrasena-routing.module';

import { OlvidarContrasenaPage } from './olvidar-contrasena.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OlvidarContrasenaPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [OlvidarContrasenaPage],
  exports: [ TranslateModule ],
})
export class OlvidarContrasenaPageModule {}
