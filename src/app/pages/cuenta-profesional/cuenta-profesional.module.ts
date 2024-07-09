import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { CuentaProfesionalPageRoutingModule } from './cuenta-profesional-routing.module';

import { CuentaProfesionalPage } from './cuenta-profesional.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CuentaProfesionalPageRoutingModule
  ],
  declarations: [CuentaProfesionalPage]
})
export class CuentaProfesionalPageModule {}
