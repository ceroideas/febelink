import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponentsModule } from './components/components.module';

@NgModule({
  imports: [
      CommonModule
    , IonicModule
    , TranslateModule.forChild(),
    SearchComponentsModule,
  ],
  exports: [
      SearchComponentsModule
  ],
  declarations: [],
  providers: []
})
export class SearchModule {}