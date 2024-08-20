import {  NgModule } from '@angular/core';

import { SearchCardComponent } from './search-card/search-card.component';
import { ProductCardComponent } from './product-card/product-card.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ SearchCardComponent, ProductCardComponent],
})
export class SearchPageModule {}
