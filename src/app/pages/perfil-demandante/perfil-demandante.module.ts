import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilDemandantePageRoutingModule } from './perfil-demandante-routing.module';

import { PerfilDemandantePage } from './perfil-demandante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilDemandantePageRoutingModule
  ],
  declarations: [PerfilDemandantePage]
})
export class PerfilDemandantePageModule {}
