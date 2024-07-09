import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteriorOfertaPageRoutingModule } from './interior-oferta-routing.module';

import { InteriorOfertaPage } from './interior-oferta.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InteriorOfertaPageRoutingModule
  ],
  declarations: [InteriorOfertaPage]
})
export class InteriorOfertaPageModule {}
