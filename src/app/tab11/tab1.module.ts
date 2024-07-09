import {  NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { Tab1Component } from './tab1.component';
// import { SearchModule } from './search/search.module';
// import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    // ComponentsModule,
    SharedModule,
    // SearchModule
  ],
  declarations: [Tab1Component]
  
  ,
})
export class Tab1ComponentModule {}
