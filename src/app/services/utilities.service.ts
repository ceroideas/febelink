import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ToastController,
  AlertController,
  LoadingController,
  Platform,
  PopoverController,
} from '@ionic/angular';
// import { Storage } from '@ionic/storage';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
// import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { getWindow } from 'ssr-window';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {

  window = getWindow();

  sessionStorage = this.window.sessionStorage;

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    // private storage: Storage,
    private titleService: Title,
    public translateService: TranslateService,
    // private clipboard: Clipboard,
   @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.sessionStorage = this.sessionStorage ;
    } else {
      // Implementación alternativa para el servidor
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
    });
    toast.present();
  }

  async showAlert(
    title: string,
    message: string,
    css?: string,
    buttons: (string | any)[] = ['OK'],
    inputs: any[] = []
  ) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: buttons,
      inputs: inputs,
      cssClass: css,
    });

    await alert.present();

    return alert;
  }

  async showLoading(message?: string, duration?: number) {
    const res = await this.loadingCtrl.create({
      message: message !== null ? message : undefined,
      duration: duration !== null ? duration : undefined,
    });

    return res.present();
  }

  dismissLoading() {
    return this.loadingCtrl.dismiss();
  }

  /**
   * Devuelve el sistema operativo del dispositivo
   */
  getPlatform() {
   
    return this.platform.is('ios') ? 'ios' : 'android';
  }

  /**
   * Obtiene la información del token de acceso a la API
   */
  getAccessTokenInfo(): Promise<{
    access_token: string;
    expires_at: string;
    token_type: string;
  }> {

      return new Promise((resolve, reject) => {
        try {
          const userData = this.sessionStorage?.getItem('accessTokenInfo');
          if (userData) {
            resolve(JSON.parse(userData));
          } else {
            // reject('No user data found in local storage.');
          }
        } catch (error) {
          reject(JSON.stringify(error));
        }
      });
      // this.storage
      //   .ready()
      //   .then(() => {
      //     this.storage
      //       .get('accessTokenInfo')
      //       .then((userData) => {
      //         resolve(userData);
      //       })
      //       .catch((error) => {
      //         reject(JSON.stringify(error));
      //       });
      //   })
      //   .catch((error) => {
      //     reject(JSON.stringify(error));
      //   });
  }

  /**
   * Guarda la información del token de acceso a la API
   */
  saveAccessTokenInfo(accessTokenInfo: {
    access_token: string;
    expires_at: string;
    token_type: string;
  }): Promise<void> {

    return new Promise((resolve, reject) => {
      try {
        this.sessionStorage?.setItem('accessTokenInfo', JSON.stringify(accessTokenInfo));
        localStorage?.setItem('accessTokenInfo', JSON.stringify(accessTokenInfo));

        resolve();
      } catch (error) {
        reject(error);
      }
    });
    // return new Promise((resolve, reject) => {

      
    //   this.storage
    //     .set('accessTokenInfo', accessTokenInfo)
    //     .then(() => {
    //       resolve();
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  }

  /**
   * Guarda los datos del usuario en el storage
   */

  saveUserData(userData: any): Promise<any> {

    return new Promise((resolve, reject) => {
      try {

        this.sessionStorage?.setItem('userData', JSON.stringify(userData));
        localStorage?.setItem('userData', JSON.stringify(userData));
        
        resolve(userData);
      } catch (error) {
        reject(error);
      }
    });

    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .set('userData', userData)
    //     .then(() => {
    //       resolve(userData);
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  }

  /**
   * Guarda los datos del usuario en el storage
   */

  saveUserSubscription(subscription:any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.sessionStorage?.setItem('subscription', JSON.stringify(subscription));
        resolve(subscription);
      } catch (error) {
        reject(error);
      }
    });

    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .set('subscription', subscription)
    //     .then(() => {
    //       resolve(null);
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  }
  async removeUserSubscription(): Promise<any> {
    try {
      // await this.storage.remove('subscription');
      // await this.storage.remove('subscription_details');

      await this.sessionStorage?.removeItem('subscription');
      await this.sessionStorage?.removeItem('subscription_details');

      return true;
    } catch (ex) {
      return ex;
    }
  }

  saveUserSubscriptionDetails(subscription_details: any): Promise<any> {
    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .set('subscription_details', subscription_details)
    //     .then(() => {
    //       resolve(null);
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });

    return new Promise((resolve, reject) => {
      try {
        this.sessionStorage?.setItem('subscription_details', JSON.stringify(subscription_details));
        resolve(subscription_details);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Obtiene los datos del usuario guardados en el storage
   */

  getUserSubscription(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const subscription = this.sessionStorage?.getItem('subscription');
        if (subscription) {
          resolve(JSON.parse(subscription));
        } else {
          resolve(null); // Resolve with null if subscription is not found
        }
      } catch (error) {
        reject(error);
      }
    });

    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .ready()
    //     .then(() => {
    //       this.storage
    //         .get('subscription')
    //         .then((subscription) => {
    //           resolve(subscription);
    //         })
    //         .catch((error) => {
    //           reject(JSON.stringify(error));
    //         });
    //     })
    //     .catch((error) => {
    //       reject(JSON.stringify(error));
    //     });
    // });
  }

  getUserSubscriptionDetails(): Promise<any> {


    return new Promise((resolve, reject) => {
      try {
        const subscription_details = this.sessionStorage?.getItem('subscription_details');
        if (subscription_details) {
          resolve(JSON.parse(subscription_details));
        } else {
          resolve(null); // Resolve with null if subscription is not found
        }
      } catch (error) {
        reject(error);
      }
    });

    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .ready()
    //     .then(() => {
    //       this.storage
    //         .get('subscription_details')
    //         .then((subscription_details) => {
    //           resolve(JSON.parse(subscription_details));
    //         })
    //         .catch((error) => {
    //           reject(JSON.stringify(error));
    //         });
    //     })
    //     .catch((error) => {
    //       reject(JSON.stringify(error));
    //     });
    // });
  }

  /**
   * Obtiene los datos del usuario guardados en el storage
   */

  getUserData(): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        const userData = this.sessionStorage?.getItem('userData');
        if (userData) {
          resolve(JSON.parse(userData));
        } else {
          resolve(null); // Resolve with null if subscription is not found
        }
      } catch (error) {
        reject(error);
      }
    });
    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .ready()
    //     .then(() => {
    //       this.storage
    //         .get('userData')
    //         .then((userData) => {
    //           resolve(userData);
    //         })
    //         .catch((error) => {
    //           reject(JSON.stringify(error));
    //         });
    //     })
    //     .catch((error) => {
    //       reject(JSON.stringify(error));
    //     });
    // });
  }

  /**
   *
   * @returns if user is admin
   */
  async isAdmin(): Promise<any> {
    const user = await this.getUserData();
    return new Promise((resolve) => {
      resolve(user.role_id == 3);
    });
  }

  /**
   * Guarda los datos de la guia en el storage
   */

  setGuia(login: any): Promise<void> {


    return new Promise((resolve, reject) => {
      try {
        this.sessionStorage?.setItem('login', JSON.stringify(login));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    
    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .set('login', login)
    //     .then(() => {
    //       resolve();
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  }

  /**
   * Obtiene los datos del usuario guardados en el storage
   */

  getGuia(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const loginData = this.sessionStorage?.getItem('login');
        if (loginData) {
          resolve(JSON.parse(loginData));
        } else {
          resolve(null); // Resolve with null if login data is not found
        }
      } catch (error) {
        reject(error);
      }
    });
    // return new Promise((resolve, reject) => {
    //   this.storage
    //     .ready()
    //     .then(() => {
    //       this.storage
    //         .get('login')
    //         .then((userData) => {
    //           resolve(userData);
    //         })
    //         .catch((error) => {
    //           reject(JSON.stringify(error));
    //         });
    //     })
    //     .catch((error) => {
    //       reject(JSON.stringify(error));
    //     });
    // });
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Remove accents, replace spaces by underscores and set all text in lowercase
   */
  textToUrl(str: string) {
    return str
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/\ /gi, '_')
      .toLowerCase();
  }

  normalizeString(str: string) {
    return str
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .toLowerCase();
  }

  wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  updateWebFavicon(icon: string, el: string | number = '32') {
    //@ts-ignore
    //TODO: NOE
    const favIcon: HTMLLinkElement = this.document.querySelector(
      '#favicon-' + el
    );
    favIcon.href = `assets/icon/${icon}.png`;
    return this;
  }

  updateWebTitle(title: string) {
    this.titleService.setTitle(title);
  }
  getWebTitle(): string {
    return this.titleService.getTitle()
      ? this.titleService.getTitle()
      : 'Febelink';
  }
}
