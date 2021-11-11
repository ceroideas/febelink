import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmailVerifiedPageRoutingModule } from './email-verified-routing.module';
import { EmailVerifiedPage } from './email-verified.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EmailVerifiedPage }]),
    EmailVerifiedPageRoutingModule,
    SharedModule,
  ],
  declarations: [EmailVerifiedPage]
})
export class EmailVerifiedPageModule {}
