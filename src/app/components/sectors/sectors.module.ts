import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicSelectableModule } from 'ionic-selectable';
import { LoadingModule } from '../loading/loading.module';
import { SectorsComponent } from './sectors.component';

@NgModule({
  imports: [
      CommonModule
    , FormsModule
    , IonicModule
    , IonicSelectableModule
    , TranslateModule.forChild()
    , LoadingModule
  ],
  exports: [
    SectorsComponent
  ],
  declarations: [
    SectorsComponent
  ],
})
export class SectorsModule {}
