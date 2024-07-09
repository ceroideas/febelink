import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ToastSvc } from './toast.service';
import { IUser } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserSessionSvc {
  user: IUser | undefined;
  static KEY: string = 'userData';

      
  constructor( 
    @Inject(PLATFORM_ID) public platformId: Object, 
    private toastSvc: ToastSvc
  ) {}

  save(user: IUser): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Convert the user object to a JSON string
        const userJSON = JSON.stringify(user);
        // Save the JSON string to sessionStorage
        sessionStorage.setItem(UserSessionSvc.KEY, userJSON);
        // Resolve the promise with true
        resolve(true);
      } catch (error) {
        // If an error occurs, reject the promise with false
        reject(false);
      }
    });
  }

  get(): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      if ( isPlatformBrowser(this.platformId) ) {
        try {
          // Retrieve the user JSON string from sessionStorage
          const userJSON = sessionStorage.getItem(UserSessionSvc.KEY);
          // If userJSON is null, resolve with null
          if (!userJSON) {
            resolve(undefined);
            return;
          }
          // Parse the user JSON string back to an object
          const user = JSON.parse(userJSON);
          // Resolve the promise with the user object
          resolve(user);
        } catch (error) {
          // If an error occurs, reject the promise with null
          reject(null);
        }
      } else {
        resolve(undefined);
      }
    });
  }

  async id() {
    return (await this.get())?.id;
  }

  async isUser(id: any) {
    return (await this.get())?.id == id;
  }

  async isLogged() {
    return (await this.get()) != null;
  }

  async checkLogged() {
    if (!(await this.get())) {
      this.toastSvc.show('common.not-logged', true);
      return false;
    }
    return true;
  }

  async isAdmin() {
    return (await this.get())?.role_id == 3;
  }
}
