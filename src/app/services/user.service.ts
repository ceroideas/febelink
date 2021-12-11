import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router
  ){}

  checkUserDataComplete(user: IUser): boolean { 
    if ( user.dni && user.telefono && user.direccion && user.email_verified_at ) return true;
    else {
      const navigationExtras: NavigationExtras = {
        state: {msg: 'tabs.tab4.need-to-complete'}
      };
      this.router.navigate(['menu', 'perfil'], navigationExtras);
      return false;
    }
  }
}
