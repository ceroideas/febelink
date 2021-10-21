import { Component, OnInit } from '@angular/core';

import { Pricing, TeamMember } from './plans.model';
import { pricingData } from './data';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})

/**
 * Plans component
 */
export class PlansComponent implements OnInit {
  pricingData: Pricing[];
  teamMembers: TeamMember[] = [
    {
      pic: 'JD',
      name: 'Juan E. Domínguez Portillo',
      tag: 'juan',
      linkedin: 'juan-e-dom%C3%ADnguez-portillo-305b72b4',
      liTag: 'es',
    },
    {
      pic: 'DB',
      name: 'David Bernal Guerrero',
      tag: 'david',
      linkedin: 'david-bernal-guerrero-74a5ba10a/',
    },
    {
      pic: 'MD',
      name: 'Miguel Díaz de Terán',
      tag: 'miguel',
      linkedin: 'migueldiazdeteran/',
    },
    {
      pic: 'MA',
      name: 'Miguel Ángel Romero de los Llanos',
      tag: 'miguelAngel',
      linkedin: 'miguel-angel-romero-de-los-llanos/',
    },
  ];
  constructor() {}

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
