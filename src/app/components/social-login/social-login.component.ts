import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
// import {
//   Facebook,
//   FacebookLoginResponse,
// } from '@awesome-cordova-plugins/facebook/ngx';
// import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { ApiService } from './../../services/api.service';
import { UtilitiesService } from './../../services/utilities.service';
import { Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss'],
})
export class SocialLoginComponent {
  public URL = 'social-login';
  public user: SocialUser | null = null;
  public provider: string| null = null;
  @Input() firstLogin: boolean| null = null;
  @Input() redirect: string| null = null;

  constructor(
    private authService: SocialAuthService,
    private platform: Platform,
    // private fb: Facebook,
    // private googlePlus: GooglePlus,
    private utilities: UtilitiesService,
    private api: ApiService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.authService.authState.subscribe((user) => {
      this.user = user;

      if (this.user) {
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('name', user.name);
        formData.append('role_id', '5');
        formData.append('google_id', user.id);

        this.auth(formData);
      }
    });
  }

  /**
   *  Get social data ( google/facebook) depending on platform
   *
   */

  socialLogin(provider: any): void {
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
          this.utilities.showToast(
            'Social Login error: ' + JSON.stringify(err)
          );
        }
      );


  }

  /**
   *  login Facebook iOS/Android
   *
   */
  loginFB() {
    // this.fb
    //   .login(['public_profile', 'email'])
    //   .then((res: FacebookLoginResponse) => {
    //     this.getFBUserDetail(res.authResponse.userID);
    //   })
    //   .catch((e) => {
    //     this.utilities.showToast('Error de conexión con el servidor');
    //     console.log('Error logging into Facebook', e);
    //   });
  }

  /**
   *  Get Facebook profile iOS/Android
   *
   */
  getFBUserDetail(userid: any) {
    // this.fb
    //   .api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
    //   .then((data) => {
    //     const formData = new FormData();
    //     formData.append('email', data.email);
    //     formData.append('name', data.name);
    //     formData.append('facebook_id', data.id);
    //     formData.append('role_id', '5');
    //     //@ts-ignore
    //     this.auth(formData, this.firstLogin);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     this.utilities.showToast('Error de conexión con el servidor');
    //   });
  }

  /**
   *  login Google plus iOS/Android
   *
   */
  googlePlusLogin() {
   
    //  this.googlePlus
    //   .login({
    //     webClientId: environment.WEB_CLIENT_ID,
    //     offline: true,
    //   })
    //   .then((data) => {
    //     const formData = new FormData();
    //     formData.append('email', data.email);
    //     formData.append('name', data.displayName);
    //     formData.append('google_id', data.userId);
    //     formData.append('role_id', '5');

    //     this.auth(formData, this.firstLogin);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     this.utilities.showToast('Error de conexión con el servidor');
    //   }); 
  }

  /**
   *  User authentication with social data with Febelink API
   *
   */
  async auth(formData: any, firstLogin?: boolean) {
    await this.utilities.showLoading();

    const authResponse = await this.api.login(
      formData,
      this.URL,
      firstLogin,
      //@ts-ignore
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

  loginWithGoogle() {
    this.socialLogin('google');
  }
}