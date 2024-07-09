import { Injectable } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { SharePopoverComponent } from '../components/share-popover/share-popover.component';
// import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(
    private platform: Platform,
    private popCtrl: PopoverController,
    // private socialSharing: SocialSharing
  ) {}

  public async exec(
    ev: any,
    route: string,
    title: string,
    message: string,
    image: any,
    id_oracle?: number
  ): Promise<boolean> {
    const url = `${environment.WEB_URL}${route}`;


    message = message !== null ? `${message} \n\n-Febelink-\n` : ''; // Default to empty string if message is null

    image = await this.isImage(image) ? image : null; // Allow image to be null

    return this.shareWeb(ev, url, title, message, image, id_oracle);
  
    // if (this.platform.is('cordova') && !id_oracle)
    //   return this.shareNative(url, title, message, image);
    // else return this.shareWeb(ev, url, title, message, image, id_oracle);
  }

  /**
   * Share Android | iOS
   */
  // private async shareNative(
  //   url: string,
  //   title: string,
  //   desc: string,
  //   image?: string
  // ): Promise<boolean> {
  //   return new Promise((resolve) =>
  //     this.socialSharing
  //       .share(title, desc, image, url)
  //       .then((result) => resolve(true))
  //       .catch((error) => resolve(false))
  //   );
  // }

  /**
   * Share Web
   */
  private async shareWeb(
    ev: any,
    url: string,
    title: string,
    desc: string,
    image?: string,
    id_oracle?: number
  ): Promise<boolean> {
    const popover = await this.popCtrl.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url, title, desc, image, id_oracle },
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    return data?.shared;
  }

  // Check if image exist
  private isImage(src:any): Promise<boolean> {
    return new Promise((resolve) => {
      var image = new Image();
      image.onerror = () => resolve(false);
      image.onload = () => resolve(true);
      image.src = src;
    });
  }
}
