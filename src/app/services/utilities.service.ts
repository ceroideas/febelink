import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, Platform, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  constructor(
      public toastCtrl: ToastController
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , private platform: Platform
    , private storage: Storage
    , private titleService: Title
    , public translateService: TranslateService
    , private clipboard: Clipboard
  ) { }
  


  async showToast( message: string ) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  async showAlert(title: string, message: string, css?: string, buttons: (string | any)[] = ['OK'], inputs: any[] = []) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: buttons,
      inputs: inputs,
      cssClass: css
    });

    await alert.present();

    return alert;
  }

   async showLoading(message?: string, duration?: number) {
     const res = await this.loadingCtrl.create({

      message: message ? message : null,
      duration: duration ? duration : null

    })
      
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
  saveAccessTokenInfo(accessTokenInfo: { access_token: string, expires_at: string, token_type: string}): Promise<void> {
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
        resolve(null);
      }).catch(error => {
        reject(error);
      })
    })
  }
  async removeUserSubscription(): Promise<any> {
    try{
      await this.storage.remove('subscription');
      await this.storage.remove('subscription_details');
      return true;
    } catch(ex){
      return ex;
    }
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
          resolve(JSON.parse(subscription_details));
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
   *  
   * @returns if user is admin 
   */
   async isAdmin(): Promise<any> {
    const user = await this.getUserData();
    return new Promise( resolve => { resolve( user.role_id == 3 ) });
  }

  /**
   * Guarda los datos de la guia en el storage
   */

  setGuia(login): Promise<void> {
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

  updateWebFavicon(icon:string, el: string | number = '32'){
    const favIcon: HTMLLinkElement = document.querySelector('#favicon' + el );
    favIcon.href = `assets/icon/${icon}.png`;
    return this;
  }

  updateWebTitle(title:string){
    this.titleService.setTitle(title);
  }
  getWebTitle(): string {
    return this.titleService.getTitle() ? this.titleService.getTitle() : 'Febelink';
  }

  async confirm(text:string, params?:any):Promise<boolean> {
    const header:string = this.translateService.instant(text+".header", params);
    const message:string = this.translateService.instant(text+".body", params);
    const confirmBtn = this.translateService.instant("common.buttons.confirm");
    const cancelmBtn = this.translateService.instant('common.buttons.cancel');
    return new Promise(async resolve => {
      const alert = await this.alertCtrl.create({
        header, message,
        buttons: [
          {
            text: cancelmBtn,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          }, {
            text: confirmBtn,
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async copyClipboard( value, showToast = true ) {
    if( !value ) {
      this.showToast( this.translateService.instant( 'common.clipboardNone' ));
      return false;
    }

    let success = true;

    if ( this.platform.is( 'cordova' )) // Native Android/iOS
      this.clipboard.copy( value );
    else { // Web
      if ( navigator.clipboard ) {
        try {
          await navigator.clipboard.writeText( value );
        } catch ( err ) {
          console.log( 'Error on Clipboard: ', err );
          success = false;
        }
      } else {
        var textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";  //avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          success = document.execCommand( 'copy' );
        } catch (err) {
          console.log( 'Error on Clipboard: ', err );
          success = false;
        }

        document.body.removeChild( textArea );
      }
    }

    if( showToast )
      this.showToast( this.translateService.instant( 'common.clipboard' + ( success ? '' : 'Err' )));

    return success;
  }
}
