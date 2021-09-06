import { Component, OnInit } from '@angular/core';

import { Pricing } from './plans.model';
import { pricingData } from './data';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})

/**
 * Plans component
 */
export class PlansComponent implements OnInit {

  pricingData: Pricing[];
  constructor() { }


  ngOnInit(): void {
    // fetches the data
    this._fetchData();
  }

  /**
   * Pricing data
   */
  private _fetchData() {
    this.pricingData = pricingData;
  }
}
