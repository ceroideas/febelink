import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { CookiesComponent } from './cookies/cookies.component';
import { SharePopoverComponent } from './share-popover/share-popover.component';
import { SocialLoginComponent } from './social-login/social-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    entryComponents: [
    ],
    declarations: [
      MenuComponent,
      CookiesComponent,
      SharePopoverComponent,
      SocialLoginComponent,
      PaginationComponent,
    ],
    exports: [
      MenuComponent,
      CookiesComponent,
      SharePopoverComponent,
      SocialLoginComponent,
      PaginationComponent,
      TranslateModule
    ],
    imports: [
      CommonModule,
      IonicModule,
      TranslateModule.forChild()
    ]
  })
  export class ComponentsModule { }