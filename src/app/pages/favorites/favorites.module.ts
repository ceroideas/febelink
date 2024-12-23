import {  NgModule } from '@angular/core';

import { ProductCardComponent } from '../../search/product-card/product-card.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ ProductCardComponent],
})
export class FavoritesPageModule {}
