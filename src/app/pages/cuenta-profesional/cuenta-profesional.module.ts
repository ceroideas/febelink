import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { CuentaProfesionalPageRoutingModule } from './cuenta-profesional-routing.module';

import { CuentaProfesionalPage } from './cuenta-profesional.page';
import { SharedModule } from '../../shared/shared.module';

import { LucideAngularModule, Dot, Trash2 } from 'lucide-angular';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    CuentaProfesionalPageRoutingModule,
    LucideAngularModule.pick({Dot, Trash2}),

  ],
  declarations: [CuentaProfesionalPage]
})
export class CuentaProfesionalPageModule {}
