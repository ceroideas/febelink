import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {SearchComponent} from './components/search/search.component';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    SharedModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  exports: [SearchComponent],
  declarations: [SearchComponent, ProductCardComponent],
  providers: []
})
export class SearchModule {
}
