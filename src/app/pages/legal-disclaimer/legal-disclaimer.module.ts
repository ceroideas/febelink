import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalDisclaimerPageRoutingModule } from './legal-disclaimer-routing.module';

import { LegalDisclaimerPage } from './legal-disclaimer.page';
import { TranslateModule } from '@ngx-translate/core';
import { LegalPointComponent } from './legal-point/legal-point.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LegalDisclaimerPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    LegalDisclaimerPage,
    LegalPointComponent,
  ],
  exports: [LegalPointComponent, TranslateModule],
})
export class LegalDisclaimerPageModule {}
