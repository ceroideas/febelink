import {  NgModule } from '@angular/core';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SharedModule } from '../shared/shared.module';

import { Tab1Page } from './tab1.page';
// import { SearchModule } from './search/search.module';
// import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    // ComponentsModule,
    Tab1PageRoutingModule,
    SharedModule,
    // SearchModule
  ],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
