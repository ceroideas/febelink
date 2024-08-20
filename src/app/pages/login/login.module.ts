import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SharedModule } from './../../shared/shared.module';
import { OlvidarContrasenaModule } from '../olvidar-contrasena/olvidar-contrasena.module';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    OlvidarContrasenaModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [LoginPage,],
})
export class LoginPageModule {}
