import { Component, OnInit } from '@angular/core';

import { Services} from './services.model';
import { serviceData } from './data';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
/**
 * Services component
 */
export class ServicesComponent implements OnInit {

  serviceData: Services[];

  constructor() { }

  ngOnInit(): void {
    // fetches the data
    this._fetchData();
  }

  /**
   * Service data
   */
  private _fetchData() {
    this.serviceData = serviceData;
  }
}
