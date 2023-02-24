import { Component, Input, OnInit } from '@angular/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss'],
})
export class SocialLoginComponent {
  public URL = 'social-login';
  public user: SocialUser;
  public provider: string;
  @Input() firstLogin: boolean;
  @Input() redirect: string;

  constructor(
    private authService: SocialAuthService,
    private platform: Platform,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    private utilities: UtilitiesService,
    private api: ApiService
  ) {}

  /**
   *  Get social data ( google/facebook) depending on platform
   *
   */
  socialLogin(provider): void {
    // Native Android/iOS
    if (this.platform.is('cordova')) {
      if (provider === 'facebook') {
        this.loginFB();
      } else {
        this.googlePlusLogin();
      }
    } else {
      // Web
      this.authService.signIn(this.getProvider(provider)).then(
        (data) => {
          const formData = new FormData();
          formData.append('email', data.email);
          formData.append('name', data.name);
          formData.append('role_id', '5');

          if (provider === 'facebook') {
            formData.append('facebook_id', data.id);
          } else {
            formData.append('google_id', data.id);
          }

          this.auth(formData);
        },
        (err) => {
          console.log('Social Login error: ', err);
          this.utilities.showToast(
            'Social Login error: ' + JSON.stringify(err)
          );
        }
      );
    }
  }

  /**
   *  login Facebook iOS/Android
   *
   */
  loginFB() {
    this.fb
      .login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.getFBUserDetail(res.authResponse.userID);
      })
      .catch((e) => {
        this.utilities.showToast('Error de conexión con el servidor');
        console.log('Error logging into Facebook', e);
      });
  }

  /**
   *  Get Facebook profile iOS/Android
   *
   */
  getFBUserDetail(userid: any) {
    this.fb
      .api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then((data) => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('name', data.name);
        formData.append('facebook_id', data.id);
        formData.append('role_id', '5');
        this.auth(formData, this.firstLogin);
      })
      .catch((e) => {
        console.log(e);
        this.utilities.showToast('Error de conexión con el servidor');
      });
  }

  /**
   *  login Google plus iOS/Android
   *
   */
  googlePlusLogin() {
    this.googlePlus
      .login({
        webClientId: environment.WEB_CLIENT_ID,
        offline: true,
      })
      .then((data) => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('name', data.displayName);
        formData.append('google_id', data.userId);
        formData.append('role_id', '5');

        this.auth(formData, this.firstLogin);
      })
      .catch((err) => {
        console.error(err);
        this.utilities.showToast('Error de conexión con el servidor');
      });
  }

  /**
   *  User authentication with social data with Febelink API
   *
   */
  async auth(formData, firstLogin?: boolean) {
    await this.utilities.showLoading();

    const authResponse = await this.api.login(
      formData,
      this.URL,
      firstLogin,
      this.redirect
    );

    this.utilities.dismissLoading();

    authResponse.subscribe(
      (results) => {},
      (err) => {
        console.log('Auth error: ', err);
        this.utilities.showToast('Error de conexión con el servidor');
        this.utilities.dismissLoading();
      }
    );
  }

  /**
   *  Get provider type ( google/facebook)
   *
   */
  getProvider(provider: string) {
    if (provider === 'facebook') {
      return FacebookLoginProvider.PROVIDER_ID;
    } else {
      return GoogleLoginProvider.PROVIDER_ID;
    }
  }
}
