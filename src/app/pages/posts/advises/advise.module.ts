import { NgModule } from '@angular/core';

import { AdviseCRUDPage } from './advise-crud/advise-crud.page';
import { AdvisePage } from './advise/advise.page';
import { AdvisesPage } from './advises/advises.page';
import { PostComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    PostComponentsModule
  ],
  declarations: [
      AdvisesPage
    , AdvisePage
    , AdviseCRUDPage
  ]
})
export class AdvisePageModule {}
