import {  NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ServiciosPageRoutingModule } from './servicios-routing.module';

import { ServiciosPage } from './servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ServiciosPageRoutingModule
  ],
  declarations: [ServiciosPage],
})
export class ServiciosPageModule {}
