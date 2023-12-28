import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Platform } from '@ionic/angular';
import { ToastSvc } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ClipboardSvc {
  constructor(
    private clipboard: Clipboard,
    private toastSvc: ToastSvc,
    private platform: Platform
  ) {}

  async copy(value, showToast = true) {
    if (!value) {
      this.toastSvc.show('common.clipboardNone', true);
      return false;
    }

    let success = true;

    if (isPlatformBrowser && this.platform.is('cordova')) {
      // Native Android/iOS
      this.clipboard.copy(value);
    } else {
      // Web
      if (isPlatformBrowser && navigator.clipboard) {
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
    }

    if (showToast)
      this.toastSvc.show('common.clipboard' + (success ? '' : 'Err'), true);

    return success;
  }
}
