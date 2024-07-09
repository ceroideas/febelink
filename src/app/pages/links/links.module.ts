import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { InterestingLinksRoutingModule } from './links-routing.module';
import { InterestingLinksPage } from './links.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, IonicModule, InterestingLinksRoutingModule],
  declarations: [InterestingLinksPage],
})
export class InterestingLinksPageModule {}
