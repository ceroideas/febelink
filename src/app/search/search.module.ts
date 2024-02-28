import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SearchPageRoutingModule } from './search-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { SearchPage } from './search.page';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchCardComponent } from './search-card/search-card.component';
import { ProductCardComponent } from './product-card/product-card.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    IonicSelectableModule,
    SearchPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    NgxSkeletonLoaderModule
  ],
  declarations: [SearchPage, SearchCardComponent, ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SearchPageModule {}
