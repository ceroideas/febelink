import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TabsPage } from './tabs.page';

@NgModule({
  declarations: [TabsPage],
  imports: [SharedModule],
  exports: [TabsPage],
})
export class TabsSharedModule {}
