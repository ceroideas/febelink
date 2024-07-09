import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfertantesPageRoutingModule } from './ofertantes-routing.module';

import { OfertantesPage } from './ofertantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfertantesPageRoutingModule
  ],
  declarations: [OfertantesPage]
})
export class OfertantesPageModule {}
