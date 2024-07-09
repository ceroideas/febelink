import { Component, OnInit } from '@angular/core';

import { Services} from './services.model';
import { serviceData } from './data';

@Component({
  selector: 'app-roadmap',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
/**
 * Services component
 */
export class ServicesComponent implements OnInit {

  serviceData: Services[] | undefined ;

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
