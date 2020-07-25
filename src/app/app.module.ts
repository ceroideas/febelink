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


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule,
            FormsModule,
            ReactiveFormsModule,
            HttpClientModule,
            ComponentsModule,
            IonicStorageModule.forRoot(),
            NgxStripeModule.forRoot('pk_live_26EQ8gc0INPEdZjy6Iy8DOnK004mMtUILK'),
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
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
