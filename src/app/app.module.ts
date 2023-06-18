import {InterestingLinksPageModule} from './pages/links/links.module';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@awesome-cordova-plugins/splash-screen/ngx';
import {StatusBar} from '@awesome-cordova-plugins/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpClientModule, HttpClient} from '@angular/common/http';
import {Push} from '@awesome-cordova-plugins/push/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {Camera} from '@awesome-cordova-plugins/camera/ngx';
import {NgxStripeModule} from 'ngx-stripe';
import {Deeplinks} from '@awesome-cordova-plugins/deeplinks/ngx';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ComponentsModule} from './components/components.module';
import {CookieService} from 'ngx-cookie-service';
import {Facebook} from '@awesome-cordova-plugins/facebook/ngx';
import {GooglePlus} from '@awesome-cordova-plugins/google-plus/ngx';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {BrowserTab} from '@awesome-cordova-plugins/browser-tab/ngx';
import {Badge} from '@awesome-cordova-plugins/badge/ngx';

/* NGX Translate imports. */
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LoginPageModule} from './pages/login/login.module';
import {AndroidPermissions} from '@awesome-cordova-plugins/android-permissions/ngx';

// Quill WYSIWYG ( What You See Is What You Get )
import {QuillModule} from 'ngx-quill';

import {Clipboard} from '@awesome-cordova-plugins/clipboard/ngx';
import {PipesModule} from './pipes/pipes.module';

// Cordova File
import {File} from '@awesome-cordova-plugins/file/ngx';
import {SharedModule} from './shared/shared.module';

function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = {
  url: environment.SOCKET_URL,
  options: {}
  // options: { secure: true, rejectUnauthorized: false },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    IonicStorageModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripe_publick_key),
    SocialLoginModule,
    LoginPageModule,
    InterestingLinksPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    QuillModule.forRoot(),
    PipesModule,
    SharedModule,
  ],
  exports: [PipesModule, AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Push,
    SocialSharing,
    BrowserTab,
    Camera,
    File,
    Deeplinks,
    CookieService,
    Facebook,
    GooglePlus,
    Badge,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.WEB_CLIENT_ID),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.FACEBOOK_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    AndroidPermissions,
    Clipboard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
