import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarDemandaPageRoutingModule } from './editar-demanda-routing.module';

import { EditarDemandaPage } from './editar-demanda.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarDemandaPageRoutingModule,
    SharedModule
  ],
  declarations: [EditarDemandaPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EditarDemandaPageModule {}
