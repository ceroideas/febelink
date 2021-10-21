import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { OlvidarContrasenaPageModule } from '../olvidar-contrasena/olvidar-contrasena.module';
import { RegistroPageModule } from '../registro/registro.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    OlvidarContrasenaPageModule,
    RegistroPageModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
