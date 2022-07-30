import {Component, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  options: Option[] = [
    {title: 'Gestión de Reservas y Airdrops', icon: 'wallet-outline', link: 'tokens-users'},
    {title: 'Gestión de Keywords - Sectores', icon: 'wallet-outline', link: 'keyword/sector'},
    {title: 'Gestión de Keywords - Subsectores', icon: 'wallet-outline', link: 'keyword/sub-sector'},
  ];

  homePage: string = environment.HOME_PAGE;
}

interface Option {
  title: string,
  icon: string,
  link: string
}
