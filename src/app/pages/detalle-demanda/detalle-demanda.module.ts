import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { DetalleDemandaPageRoutingModule } from './detalle-demanda-routing.module';

import { DetalleDemandaPage } from './detalle-demanda.page';

@NgModule({
  imports: [
    SharedModule,
    DetalleDemandaPageRoutingModule
  ],
  declarations: [DetalleDemandaPage]
})
export class DetalleDemandaPageModule {}
