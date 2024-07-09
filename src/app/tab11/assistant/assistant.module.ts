import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AssistantComponentsModule } from './components/components.module';

@NgModule({
  imports: [
      CommonModule
    , IonicModule
    , TranslateModule.forChild()
    , AssistantComponentsModule
  ],
  exports: [
      AssistantComponentsModule
  ],
  declarations: [],
  providers: []
})
export class AssistantModule {}
