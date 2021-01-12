import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RouterModule } from '@angular/router';
import { Tab3Page } from './tab3.page';
import { Tab3PageRoutingModule } from './tab3-routing.module'

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
