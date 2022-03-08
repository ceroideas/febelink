import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostStatsComponent } from './advises/stats/stats.component';
import { ReactTypesComponent } from './components/react-types/react-types.component';
import { PostSummaryComponent } from './components/summary/summary.component';

@NgModule({
  imports: [
    CommonModule
  , IonicModule
  , TranslateModule.forChild()
  , SharedModule
],
  exports: [
      PostStatsComponent
    , PostSummaryComponent
    , ReactTypesComponent
  ],
  declarations: [
      PostStatsComponent
    , PostSummaryComponent
    , ReactTypesComponent
  ],
})
export class SharedPostModule {}
