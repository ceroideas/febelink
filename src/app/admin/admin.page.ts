import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import { isPlatformBrowser } from '@angular/common';

interface Menu {
  name: string,
  items: Option[]
}

interface Option {
  title: string,
  icon: string,
  link: string,
  disabled?: boolean;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  isBrowser: boolean = false;

  menu: Menu[] = [
    {
      name: 'Profesionales',
      items: [
        {title: 'Sectores', icon: 'factory', link: '/admin/sectors'},
        {title: 'Profesiones', icon: 'briefcase-business', link: '/admin/subsectors'},
      ]
    },
    {
      name: 'Ubicación',
      items: [
        {title: 'Provincias', icon: 'map', link: '/admin/provinces'},
        {title: 'Ciudades', icon: 'map-pin', link: '/admin/cities'},
        {title: 'Barrios', icon: 'arrow-down-to-dot', link: '', disabled: true},
      ]
    },
    {
      name: 'Trabajos',
      items: [
        {title: 'Solicitudes', icon: 'briefcase-business', link: '/admin/budget'}
      ]
    },
    {
      name: 'Analítica',
      items: [
        {title: 'Clicks', icon: 'mouse-pointer-click', link: '/admin/clicks'},
      ]
    },
    {
      name: 'Otros',
      items: [
        {title: 'Reservas y Airdrops', icon: 'wallet', link: '/admin/tokens-users'},
        {title: 'Enlaces de footer', icon: 'link', link: '/admin/footer-links'},
      ]
    }
  ]

  currentRoute: string = '';

  // options: Option[] = [
  //   {title: 'Reservas y Airdrops', icon: 'wallet', link: 'admin/tokens-users'},
  //   {title: 'Sectores', icon: 'factory', link: 'admin/sectors'},
  //   {title: 'Profesiones', icon: 'briefcase-business', link: 'admin/subsectors'},
  //   {title: 'Ubicaciones', icon: 'map', link: 'admin/keyword/location'},
  //   {title: 'Enlaces de ubicaciones', icon: 'link-outline', link: 'keyword/link-location'},
  //   {title: 'Ciudades', icon: 'map-pin', link: 'admin/keyword/city'},
  //   {title: 'Barrios', icon: 'arrow-down-to-dot', link: '', disabled: true},
  //   {title: 'Enlaces de ciudades', icon: 'link-outline', link: 'keyword/link-city'},
  //   {title: 'Enlaces de footer', icon: 'link', link: 'admin/keyword/link-footer'},
  //   {title: 'Clicks', icon: 'mouse-pointer-click', link: 'admin/keyword/clicks'},
  // ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    this.router.events.subscribe((event) => {
      if ( event instanceof NavigationEnd ) {
        this.currentRoute = event.url;

        if ( event.url === '/admin' ) {
          this.router.navigate(['admin/sectors']);
        }
      } 
    });
  }
}
