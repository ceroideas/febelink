import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingBLComponent } from './loading.component';

@NgModule({
  imports: [
      CommonModule
    , IonicModule
    , TranslateModule.forChild()
  ],
  exports: [
    LoadingBLComponent
  ],
  declarations: [
    LoadingBLComponent
  ],
})
export class LoadingModule {}
