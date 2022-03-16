import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FollowerButtonComponent } from './button/follower-button.component';

@NgModule({
  imports: [
      CommonModule
    , IonicModule
    , TranslateModule.forChild()
  ],
  exports: [
    FollowerButtonComponent
  ],
  declarations: [
    FollowerButtonComponent
  ],
})
export class FollowerButtonModule {}
