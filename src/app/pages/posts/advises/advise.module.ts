import { NgModule } from '@angular/core';
import { AdvisesPage } from './advises/advises.page';
import { AdviseCRUDPage } from './advise-crud/advise-crud.page';
import { SharedModule } from '../../../shared/shared.module';

// import { AdviseCRUDPage } from './advise-crud/advise-crud.page';
import { AdvisePage } from './advise/advise.page';
// import { AdvisesPage } from './advises/advises.page';
// import { PostComponentsModule } from '../components/components.module';
// import { LoadingModule } from './../../../components/loading/loading.module';
// import { SectorsModule } from './../../../components/sectors/sectors.module';

@NgModule({
  imports: [
    SharedModule,
    
   ],
  declarations: [
     AdvisesPage,
     AdvisePage, 
     AdviseCRUDPage,
    //  PostComponent
   ],
})
export class AdvisePageModule {}
