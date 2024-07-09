import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Platform } from '@ionic/angular';
import { ToastSvc } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ClipboardSvc {
  constructor(
    // private clipboard: Clipboard,
    private toastSvc: ToastSvc,
    private platform: Platform,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  async copy(value: any, showToast = true) {
    if (!value) {
      this.toastSvc.show('common.clipboardNone', true);
      return false;
    }

    let success = true;
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        console.log('Error on Clipboard: ', err);
        success = false;
      }
    } else {
      var textArea = document.createElement('textarea');
      textArea.value = value;
      textArea.style.position = 'fixed'; //avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.log('Error on Clipboard: ', err);
        success = false;
      }

      document.body.removeChild(textArea);
    }

    // if (isPlatformBrowser(this.platformId) && this.platform.is('cordova')) {
    //   // Native Android/iOS
    //   // this.clipboard.copy(value);
    // } else {
    //   // Web
    //   if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
    //     try {
    //       await navigator.clipboard.writeText(value);
    //     } catch (err) {
    //       console.log('Error on Clipboard: ', err);
    //       success = false;
    //     }
    //   } else {
    //     var textArea = document.createElement('textarea');
    //     textArea.value = value;
    //     textArea.style.position = 'fixed'; //avoid scrolling to bottom
    //     document.body.appendChild(textArea);
    //     textArea.focus();
    //     textArea.select();

    //     try {
    //       success = document.execCommand('copy');
    //     } catch (err) {
    //       console.log('Error on Clipboard: ', err);
    //       success = false;
    //     }

    //     document.body.removeChild(textArea);
    //   }
    // }

    if (showToast)
      this.toastSvc.show('common.clipboard' + (success ? '' : 'Err'), true);

    return success;
  }
}
