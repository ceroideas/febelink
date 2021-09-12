import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';

import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    IonicSelectableModule,
    Tab1PageRoutingModule,
  ],
  declarations: [Tab1Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab1PageModule {}
