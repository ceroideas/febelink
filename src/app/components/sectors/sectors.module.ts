import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SectorsComponent } from './sectors.component';

@NgModule({
  imports: [
      CommonModule,
    
  ],
  exports: [
    SectorsComponent
  ],
  declarations: [
    SectorsComponent
  ],
})
export class SectorsModule {}
