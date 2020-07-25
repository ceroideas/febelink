import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidarContrasenaPageRoutingModule } from './olvidar-contrasena-routing.module';

import { OlvidarContrasenaPage } from './olvidar-contrasena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OlvidarContrasenaPageRoutingModule
  ],
  declarations: [OlvidarContrasenaPage]
})
export class OlvidarContrasenaPageModule {}
