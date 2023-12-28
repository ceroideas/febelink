import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { InterestingLinksRoutingModule } from './links-routing.module';
import { InterestingLinksPage } from './links.page';

@NgModule({
  imports: [SharedModule, IonicModule, InterestingLinksRoutingModule],
  declarations: [InterestingLinksPage],
})
export class InterestingLinksPageModule {}
