import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealizarOfertaPageRoutingModule } from './realizar-oferta-routing.module';

import { RealizarOfertaPage } from './realizar-oferta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RealizarOfertaPageRoutingModule
  ],
  declarations: [RealizarOfertaPage]
})
export class RealizarOfertaPageModule {}
