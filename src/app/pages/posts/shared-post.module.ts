import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostStatsComponent } from './advises/stats/stats.component';

@NgModule({
  imports: [
    CommonModule
  , IonicModule
  , TranslateModule.forChild()
  , SharedModule
],
  exports: [
      PostStatsComponent
  ],
  declarations: [
      PostStatsComponent
  ],
})
export class SharedPostModule {}
