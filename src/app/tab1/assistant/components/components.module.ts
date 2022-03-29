import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssistantPopComponent } from '../pop/pop.component';
import { AssistantFormComponent } from './form/form.component';
import { AssistantSearchComponent } from './search/search.component';

@NgModule({
  imports: [
      SharedModule
    , CommonModule
    , IonicModule
    , TranslateModule.forChild()
  ],
  exports: [
      AssistantPopComponent
    , AssistantSearchComponent
    , AssistantFormComponent
  ],
  declarations: [
      AssistantPopComponent
    , AssistantSearchComponent
    , AssistantFormComponent
  ],
})
export class AssistantComponentsModule {}
