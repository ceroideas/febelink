import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [SharedModule, TabsPageRoutingModule],
  declarations: [TabsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsPageModule {}
