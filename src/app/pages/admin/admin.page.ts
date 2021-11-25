import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  options:Option[] = [
    {title:'Gestionar tokens de usuarios', icon:'wallet-outline', link:'tokens-users'}
  ]

}

interface Option {
  title:string, 
  icon: string, 
  link:string
}
