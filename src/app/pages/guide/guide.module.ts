import { NgModule } from '@angular/core';


import { GuidePageRoutingModule } from './guide-routing.module';

import { GuidePage } from './guide.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    GuidePageRoutingModule,
    SharedModule
  ],
  declarations: [GuidePage]
})
export class GuidePageModule {}
