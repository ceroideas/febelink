import {Component, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  options: Option[] = [
    {title: 'Reservas y Airdrops', icon: 'wallet-outline', link: 'tokens-users'},
    {title: 'Sectores', icon: 'file-tray-outline', link: 'keyword/sector'},
    {title: 'Subsectores', icon: 'file-tray-stacked-outline', link: 'keyword/sub-sector'},
    {title: 'Ubicaciones', icon: 'location-outline', link: 'keyword/location'},
    {title: 'Enlaces de ubicaciones', icon: 'link-outline', link: 'keyword/link-location'},
  ];

  homePage: string = environment.HOME_PAGE;
}

interface Option {
  title: string,
  icon: string,
  link: string
}
