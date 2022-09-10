import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
      SharedModule
    , CommonModule
    , IonicModule
    , TranslateModule.forChild(),
    HttpClientModule
  ],
  exports: [
    SearchComponent
  ],
  declarations: [
    SearchComponent
  ],
})
export class SearchComponentsModule {}