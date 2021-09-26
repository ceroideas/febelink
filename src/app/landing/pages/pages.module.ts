import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './page-routing.module';
import { SharedModule } from '../shared/shared.module';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { Index1Component } from './index1/index1.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TimerComponent } from 'src/app/components/timer/timer.component';

@NgModule({
  declarations: [ Index1Component, TimerComponent ],
  imports: [
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    HttpClientModule,
    SharedModule,
    // NgbModalModule,
    // NgxYoutubePlayerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
