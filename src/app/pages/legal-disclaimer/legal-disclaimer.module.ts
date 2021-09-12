import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalDisclaimerPageRoutingModule } from './legal-disclaimer-routing.module';

import { LegalDisclaimerPage } from './legal-disclaimer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalDisclaimerPageRoutingModule
  ],
  declarations: [LegalDisclaimerPage]
})
export class LegalDisclaimerPageModule {}
