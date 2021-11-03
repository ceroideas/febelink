import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  constructor( public toastCtrl: ToastController,
               public alertCtrl: AlertController,
               public loadingCtrl: LoadingController,
               private platform: Platform,
               private storage: Storage,
               private titleService: Title) { }
  


  async showToast( message: string ) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

   async showLoading(message?: string, duration?: number) {
     const res = await this.loadingCtrl.create({

      message: message ? message : null,
      duration: duration ? duration : null

    })
      
    return res.present();
  
  }

  dismissLoading() {
    this.loadingCtrl.dismiss();
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
  getAccessTokenInfo(): Promise<{ access_token: string, expires_at: string, token_type: string}> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('accessTokenInfo').then(userData => {
          resolve(userData);
        }).catch(error => {
          reject(JSON.stringify(error));
        })
      }).catch(error => {
        reject(JSON.stringify(error));
      })
    })
  }

  /**
   * Guarda la información del token de acceso a la API
   */
  saveAccessTokenInfo(accessTokenInfo: { access_token: string, expires_at: string, token_type: string}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set('accessTokenInfo', accessTokenInfo).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  /**
   * Guarda los datos del usuario en el storage
   */

  saveUserData(userData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set('userData', userData).then(() => {
        resolve(userData);
      }).catch(error => {
        reject(error);
      })
    })
  }

  /**
   * Guarda los datos del usuario en el storage
   */

  saveUserSubscription(subscription): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set('subscription', subscription).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  saveUserSubscriptionDetails(subscription_details): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set('subscription_details', subscription_details).then(() => {
        resolve(null);
      }).catch(error => {
        reject(error);
      })
    })
  }

  /**
   * Obtiene los datos del usuario guardados en el storage
   */

  getUserSubscription(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('subscription').then(subscription => {
          resolve(subscription);
        }).catch(error => {
          reject(JSON.stringify(error));
        })
      }).catch(error => {
        reject(JSON.stringify(error));
      })
    })
  }

  getUserSubscriptionDetails(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('subscription_details').then(subscription_details => {
          resolve(subscription_details);
        }).catch(error => {
          reject(JSON.stringify(error));
        })
      }).catch(error => {
        reject(JSON.stringify(error));
      })
    })
  }

  /**
   * Obtiene los datos del usuario guardados en el storage
   */

  getUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('userData').then(userData => {
          resolve(userData);
        }).catch(error => {
          reject(JSON.stringify(error));
        })
      }).catch(error => {
        reject(JSON.stringify(error));
      })
    })
  }

  /**
   * Guarda los datos de la guia en el storage
   */

  setGuia(login): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set('login', login).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

   /**
   * Obtiene los datos del usuario guardados en el storage
   */

  getGuia(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get('login').then(userData => {
          resolve(userData);
        }).catch(error => {
          reject(JSON.stringify(error));
        })
      }).catch(error => {
        reject(JSON.stringify(error));
      })
    })
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Remove accents, replace spaces by underscores and set all text in lowercase
   */
  textToUrl(str:string){
    return str.normalize ("NFKD").replace(/[\u0300-\u036F]/g, "").replace(/\ /gi,"_").toLowerCase();
  }

  wait(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateWebFavicon(icon:string){
    const favIcon: HTMLLinkElement = document.querySelector('#favicon');
    favIcon.href = `assets/icon/${icon}.png`;
  }

  updateWebTitle(title:string){
    this.titleService.setTitle(title);
  }
  getWebTitle(): string {
    return this.titleService.getTitle() ? this.titleService.getTitle() : 'Febelink';
  }

}
