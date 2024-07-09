import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessPageRoutingModule } from './success-routing.module';

import { SuccessPage } from './success.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessPageRoutingModule,
    SharedModule
  ],
  declarations: [SuccessPage]
})
export class SuccessPageModule {}
