import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { Tab4PageRoutingModule } from './tab4-routing.module'
import { IonicSelectableModule } from 'ionic-selectable';

import { Tab4Page } from './tab4.page';


@NgModule({
  imports: [
    SharedModule,
    IonicSelectableModule,
    RouterModule.forChild([{ path: '', component: Tab4Page }]),
    Tab4PageRoutingModule,
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
