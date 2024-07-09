import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicarOpinionPageRoutingModule } from './publicar-opinion-routing.module';

import { PublicarOpinionPage } from './publicar-opinion.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PublicarOpinionPageRoutingModule
  ],
  declarations: [PublicarOpinionPage]
})
export class PublicarOpinionPageModule {}
