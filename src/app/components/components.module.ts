import {
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import {GoogleSigninButtDirective} from './social-login/google-sign-in-button.directive';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MenuComponent} from './menu/menu.component';
import {CookiesComponent} from './cookies/cookies.component';
import {SharePopoverComponent} from './share-popover/share-popover.component';
import {SocialLoginComponent} from './social-login/social-login.component';
import {TranslateModule} from '@ngx-translate/core';
import {PartialPopupComponent} from './partial-popup/partial-popup.component';
import {FormsModule} from '@angular/forms';
import { environment } from '../../environments/environment';
import { AskForBudgetComponent } from './ask-for-budget/ask-for-budget.component';
@NgModule({
  declarations: [
    MenuComponent,
    CookiesComponent,
    SharePopoverComponent,
    SocialLoginComponent,
    GoogleSigninButtDirective,
    PartialPopupComponent,
    AskForBudgetComponent
  ],
  exports: [
    MenuComponent,
    CookiesComponent,
    SharePopoverComponent,
    SocialLoginComponent,
    TranslateModule,
    PartialPopupComponent,
    AskForBudgetComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    GoogleSigninButtonModule,
  ],
  // providers: [
  //   {
  //     provide: 'SocialAuthServiceConfig',
  //     useValue: {
  //       autoLogin: true,
  //       providers: [
  //         {
  //           id: GoogleLoginProvider.PROVIDER_ID,
  //           provider: new GoogleLoginProvider(environment.WEB_CLIENT_ID),
  //         },
  //         {
  //           id: FacebookLoginProvider.PROVIDER_ID,
  //           provider: new FacebookLoginProvider(environment.FACEBOOK_ID),
  //         },
  //       ],
  //     } as SocialAuthServiceConfig,
  //   },
  // ],
})
export class ComponentsModule {
}
