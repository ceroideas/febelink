import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicarDemandaPageRoutingModule } from './publicar-demanda-routing.module';

import { PublicarDemandaPage } from './publicar-demanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PublicarDemandaPageRoutingModule
  ],
  declarations: [PublicarDemandaPage]
})
export class PublicarDemandaPageModule {}
