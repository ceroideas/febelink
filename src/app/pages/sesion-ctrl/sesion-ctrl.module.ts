import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SesionCtrlPageRoutingModule } from './sesion-ctrl-routing.module';

import { SesionCtrlPage } from './sesion-ctrl.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SesionCtrlPageRoutingModule
  ],
  declarations: [SesionCtrlPage]
})
export class SesionCtrlPageModule {}
