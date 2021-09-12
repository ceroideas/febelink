import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';

@NgModule({
  imports: [SharedModule, Tab2PageRoutingModule, IonicSelectableModule],
  declarations: [Tab2Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab2PageModule {}
