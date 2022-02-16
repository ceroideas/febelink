import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvisePageRoutingModule } from './advise-routing.module';

import { AdviseCRUDPage } from './advise-crud/advise-crud.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdvisePage } from './advise/advise.page';
import { AdvisesPage } from './advises/advises.page';

@NgModule({
  imports: [
      CommonModule
    , FormsModule
    , ReactiveFormsModule 
    , IonicModule
    , AdvisePageRoutingModule
    , SharedModule
  ],
  declarations: [
      AdvisesPage
    , AdvisePage
    , AdviseCRUDPage
  ]
})
export class AdvisePageModule {}
