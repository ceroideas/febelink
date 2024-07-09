import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollspyDirective } from './scrollspy.directive';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { ServicesComponent } from './services/services.component';
import { FeaturesComponent } from './features/features.component';
import { ClientsComponent } from './clients/clients.component';
import { PlansComponent } from './plans/plans.component';
import { FooterComponent } from './footer/footer.component';
import { BuyTokensComponent } from './buy-tokens/buy-tokens.component';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { PhasesComponent } from './phases/phases.component';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { FormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { GoBuyTokensComponent } from './go-buy-tokens/go-buy-tokens.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule as GeneralSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ServicesComponent,
    FeaturesComponent,
    ClientsComponent,
    PlansComponent,
    FooterComponent,
    ScrollspyDirective,
    BuyTokensComponent,
    WhitelistComponent,
    SocialLinksComponent,
    PhasesComponent,
    UserDataFormComponent,
    GoBuyTokensComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    FormsModule,
    IonicSelectableModule,
    TranslateModule.forChild(),
    GeneralSharedModule,
  ],
  exports: [
    ServicesComponent,
    FeaturesComponent,
    ClientsComponent,
    PlansComponent,
    FooterComponent,
    ScrollspyDirective,
    BuyTokensComponent,
    WhitelistComponent,
    SocialLinksComponent,
    PhasesComponent,
    GoBuyTokensComponent,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {} // ToDo: DUPLICATED NAMES!!! We should change the name to LandingSharedModule
