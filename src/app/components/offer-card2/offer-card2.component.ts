import { Component, Input, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { toSlug } from '../../../utils/utils';

@Component({
  selector: 'app-offer-card2',
  templateUrl: './offer-card2.component.html'
})
export class OfferCard2Component implements OnInit {

  @Input() offer: any;

  urlWsrv: string = environment.baseWebUrlWsrv;

  toSlug = toSlug;

  constructor() { }

  ngOnInit() {}

}
