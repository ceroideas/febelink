import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsSharedModule } from './tabs.shared.module';

@NgModule({
  imports: [TabsPageRoutingModule, TabsSharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsPageModule {}
