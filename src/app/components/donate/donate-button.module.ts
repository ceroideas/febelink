import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DonateButtonComponent } from './donate-button.component';

@NgModule({
  imports: [
      CommonModule
    , IonicModule
    , TranslateModule.forChild()
  ],
  exports: [
    DonateButtonComponent
  ],
  declarations: [
    DonateButtonComponent
  ],
})
export class DonateButtonModule {}
