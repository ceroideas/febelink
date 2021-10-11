import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { LangPopComponent } from 'src/app/components/langs/popover/pop.component';

@NgModule({
  declarations: [
      RegistroPage
    , LangBtnComponent
    , LangPopComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    ComponentsModule,
    ComponentsModule,
    TranslateModule.forChild(),
  ],
  exports: [
      TranslateModule
    , LangBtnComponent
    , LangPopComponent
  ]
})
export class RegistroPageModule {}
