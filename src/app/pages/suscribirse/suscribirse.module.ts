import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuscribirsePageRoutingModule } from './suscribirse-routing.module';

import { SuscribirsePage } from './suscribirse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SuscribirsePageRoutingModule
  ],
  declarations: [SuscribirsePage]
})
export class SuscribirsePageModule {}
