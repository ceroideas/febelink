import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  options:Option[] = [
    {title:'Gestionar tokens de usuarios', icon:'wallet-outline', link:'tokens-users'}
  ]

  homePage: string = environment.HOME_PAGE
}

interface Option {
  title:string, 
  icon: string, 
  link:string
}
