import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { CookiesComponent } from './cookies/cookies.component';
import { SharePopoverComponent } from './share-popover/share-popover.component';
import { SocialLoginComponent } from './social-login/social-login.component';

@NgModule({
    entryComponents: [
    ],
    declarations: [
      MenuComponent,
      CookiesComponent,
      SharePopoverComponent,
      SocialLoginComponent
    ],
    exports: [
      MenuComponent,
      CookiesComponent,
      SharePopoverComponent,
      SocialLoginComponent
    ],
    imports: [
      CommonModule,
      IonicModule
    ]
  })
  export class ComponentsModule { }