import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentaProfesionalPageRoutingModule } from './cuenta-profesional-routing.module';

import { CuentaProfesionalPage } from './cuenta-profesional.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CuentaProfesionalPageRoutingModule
  ],
  declarations: [CuentaProfesionalPage]
})
export class CuentaProfesionalPageModule {}
