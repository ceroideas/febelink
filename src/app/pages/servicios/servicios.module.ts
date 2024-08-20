import {  NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Sparkles } from 'lucide-angular';

import { ServiciosPageRoutingModule } from './servicios-routing.module';

import { ServiciosPage } from './servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ServiciosPageRoutingModule,
    LucideAngularModule.pick({Sparkles}),
  ],
  declarations: [ServiciosPage],
})
export class ServiciosPageModule {}
