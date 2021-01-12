import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { PerfilDemandantePageRoutingModule } from './perfil-demandante-routing.module';

import { PerfilDemandantePage } from './perfil-demandante.page';

@NgModule({
  imports: [
    SharedModule,
    PerfilDemandantePageRoutingModule
  ],
  declarations: [PerfilDemandantePage]
})
export class PerfilDemandantePageModule {}
