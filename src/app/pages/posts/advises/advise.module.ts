import { NgModule } from '@angular/core';

import { AdviseCRUDPage } from './advise-crud/advise-crud.page';
import { AdvisePage } from './advise/advise.page';
import { AdvisesPage } from './advises/advises.page';
import { PostComponentsModule } from '../components/components.module';
import { LoadingModule } from 'src/app/components/loading/loading.module';
import { SectorsModule } from 'src/app/components/sectors/sectors.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [PostComponentsModule, SectorsModule, LoadingModule, SharedModule],
  declarations: [AdvisesPage, AdvisePage, AdviseCRUDPage],
})
export class AdvisePageModule {}
