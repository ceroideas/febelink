import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalDisclaimerPageRoutingModule } from './legal-disclaimer-routing.module';

import { LegalDisclaimerPage } from './legal-disclaimer.page';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LegalDisclaimerPageRoutingModule,
    SharedModule
  ],
  declarations: [
    LegalDisclaimerPage,
  ],
  exports: [
     ],
})
export class LegalDisclaimerPageModule {}
