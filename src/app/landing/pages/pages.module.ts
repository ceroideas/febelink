import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './page-routing.module';
import { SharedModule } from '../shared/shared.module';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { Index1Component } from './index1/index1.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    Index1Component
  ],
  imports: [
    CommonModule,
    ScrollToModule.forRoot(),
    FormsModule,
    PagesRoutingModule,
    HttpClientModule,
    SharedModule,
    // NgbModalModule,
    // NgxYoutubePlayerModule,
  ],
})
export class PagesModule {}
