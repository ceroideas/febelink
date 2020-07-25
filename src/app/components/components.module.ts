import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { CookiesComponent } from './cookies/cookies.component';
import { SharePopoverComponent } from './share-popover/share-popover.component';

@NgModule({
    entryComponents: [
    ],
    declarations: [
      MenuComponent,
      CookiesComponent,
      SharePopoverComponent
    ],
    exports: [
      MenuComponent,
      CookiesComponent,
      SharePopoverComponent
    ],
    imports: [
      CommonModule,
      IonicModule
    ]
  })
  export class ComponentsModule { }