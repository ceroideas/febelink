import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { UtilitiesService } from '../utilities.service';

const USER_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private utilities: UtilitiesService, private platform: Platform) {
    this.platform.ready().then(() => {
      this.checkUserData();
    });
  }

    /**
     * Description [This method check if user data exists in storage.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name checkUserData
     * @returns {void}
     */

    async checkUserData() {
      await this.utilities.getUserData().then((data) => {
        if (data) {
          this.authenticationState.next(true);
        }
      });
    }

  /**
     * Description [This method performs the user's login to the APP.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name login
     * @param {ILoginData} loginData - User email and password credentials.
     * @returns {void}
     */
    // TODO: Updated functionality
    login() {
          this.authenticationState.next(true);
    }

  /**
   * Description [This method performs the user's logout to the APP.]
   *
   * @author abrito
   * @version 0.0.1
   *
   * @method
   * @name logout
   * @returns {Promise}
   */
  logout() {
      // return this.storage.remove(USER_KEY).then(() => {
          this.authenticationState.next(false);
      // });
  }

    /**
     * Description [This method check if user is authenticated in the APP.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name isAuthenticated
     * @returns {boolean}
     */
    isAuthenticated() {
      return this.authenticationState.value;
    }

}
