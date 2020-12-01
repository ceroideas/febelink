import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Push } from '@ionic-native/push/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { NgxStripeModule } from 'ngx-stripe';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ComponentsModule } from './components/components.module';
import { CookieService } from 'ngx-cookie-service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

const config: SocketIoConfig = { url: 'https://api.febelink.com:3425', options: {secure: true, rejectUnauthorized: false}};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule,
            FormsModule,
      SocketIoModule.forRoot(config),
            ReactiveFormsModule,
            HttpClientModule,
            ComponentsModule,
            IonicStorageModule.forRoot(),
            NgxStripeModule.forRoot('pk_live_26EQ8gc0INPEdZjy6Iy8DOnK004mMtUILK'),
            SocialLoginModule,
            ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
            ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Push,
    SocialSharing,

    Camera,
    Deeplinks,
    CookieService,
    Facebook,
    GooglePlus,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.WEB_CLIENT_ID
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.FACEBOOK_ID),
          }
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
