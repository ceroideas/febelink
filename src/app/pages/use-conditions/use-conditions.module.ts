import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UseConditionsPageRoutingModule } from './use-conditions-routing.module';

import { UseConditionsPage } from './use-conditions.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    
    SharedModule,
    UseConditionsPageRoutingModule
  ],
  declarations: [UseConditionsPage]
})
export class UseConditionsPageModule {}
