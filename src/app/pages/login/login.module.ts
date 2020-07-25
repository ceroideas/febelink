import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { OlvidarContrasenaPageModule } from '../olvidar-contrasena/olvidar-contrasena.module';
import { RegistroPageModule } from '../registro/registro.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    OlvidarContrasenaPageModule,
    RegistroPageModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
