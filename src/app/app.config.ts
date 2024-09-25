import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { RouteReuseStrategy, provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser'
import { SharedModule } from './shared/shared.module'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { IonicStorage  Module } from '@ionic/storage'
import { provideAnimations } from '@angular/platform-browser/animations'
import { environment } from '../environments/environment'
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';


// import {Facebook} from '@awesome-cordova-plugins/facebook/ngx';
// import {GooglePlus} from '@awesome-cordova-plugins/google-plus/ngx';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { LoginPageModule } from './pages/login/login.module'
import { NgxStripeModule } from 'ngx-stripe'
import { InterestingLinksPageModule } from './pages/links/links.module'
import { QuillModule } from 'ngx-quill'


import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

  const config: SocketIoConfig = {
    url: environment.SOCKET_URL,
    options: {}
    // options: { secure: true, rejectUnauthorized: false },
  };
export const appConfig: ApplicationConfig = {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                environment.WEB_CLIENT_ID
              )
            }
          ],
          onError: (err: any) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      },
      provideIonicAngular(),
        provideHttpClient(withFetch()), 
        provideClientHydration(
          withHttpTransferCacheOptions({
            includePostRequests: false,
          }),
        ), 
        provideRouter(routes), 
        provideAnimations(), 
        importProvidersFrom(
            InterestingLinksPageModule,
            SocketIoModule.forRoot(config),
            SharedModule,
            HttpClientModule,
            NgxStripeModule.forRoot(environment.stripe_publick_key),
           
            QuillModule.forRoot(),
            TranslateModule.forRoot({
                defaultLanguage: 'en',
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient]
                }
            }),
        ),
      
    ],
}
