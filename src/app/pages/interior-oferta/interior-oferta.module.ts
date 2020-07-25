import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteriorOfertaPageRoutingModule } from './interior-oferta-routing.module';

import { InteriorOfertaPage } from './interior-oferta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteriorOfertaPageRoutingModule
  ],
  declarations: [InteriorOfertaPage]
})
export class InteriorOfertaPageModule {}
