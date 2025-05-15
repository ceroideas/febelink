import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';
import { UtilitiesService } from '../services/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(private router: Router, private utilities: UtilitiesService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.utilities.getUserData()
        .then((userData: IUser) => {
          if (userData && userData.role_id === 3) {
            resolve(true);
          } else {
            this.router.navigate(['/']);
            resolve(false);
          }
        })
        .catch(() => {
          this.router.navigate(['/']);
          resolve(false);
        });
    });
  }
} 