import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsLogPageRoutingModule } from './notifications-log-routing.module';

import { NotificationsLogPage } from './notifications-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsLogPageRoutingModule
  ],
  declarations: [NotificationsLogPage]
})
export class NotificationsLogPageModule {}
