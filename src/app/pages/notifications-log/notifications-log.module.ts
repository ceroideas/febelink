import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsLogPageRoutingModule } from './notifications-log-routing.module';

import { NotificationsLogPage } from './notifications-log.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsLogPageRoutingModule,
    SharedModule,
  ],
  declarations: [NotificationsLogPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationsLogPageModule {}
