import { NgModule } from '@angular/core';


import { UserDataPageRoutingModule } from './user-data-routing.module';

import { UserDataPage } from './user-data.page';
import { SharedModule } from './../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    UserDataPageRoutingModule
  ],
  declarations: [UserDataPage]
})
export class UserDataPageModule {}
