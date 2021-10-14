import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalDisclaimerPageRoutingModule } from './legal-disclaimer-routing.module';

import { LegalDisclaimerPage } from './legal-disclaimer.page';
import { TranslateModule } from '@ngx-translate/core';
import { TypeofPipe } from 'src/app/pipes/typeof.pipe';
import { LegalPointComponent } from './legal-point/legal-point.component';
import { SafeHtmlPipe } from 'src/app/pipes/safehtml.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalDisclaimerPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [
      LegalDisclaimerPage
    , TranslateModule
    , TypeofPipe
    , SafeHtmlPipe
    , LegalPointComponent
  ],
  exports: [
      TypeofPipe
    , SafeHtmlPipe
    , LegalPointComponent
  ]
})
export class LegalDisclaimerPageModule {}
