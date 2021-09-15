import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollspyDirective } from './scrollspy.directive';
// import { FeatherModule } from 'angular-feather';
import { CarouselModule } from 'ngx-owl-carousel-o';
// import { CountToModule } from 'angular-count-to';
// import {
//   Grid, Edit, Headphones, Layers, Code, Tablet, BarChart2, Check, PieChart, ArrowRight, Bookmark, Coffee, Award,
//   UserPlus, MapPin, Mail, Phone
// } from 'angular-feather/icons';

// const icons = {
//   Grid, Edit, Headphones, Layers, Code, Tablet, BarChart2, Check, PieChart, ArrowRight, Bookmark,
//   UserPlus, Coffee, Award, MapPin, Mail, Phone
// };

import { ServicesComponent } from './services/services.component';
import { FeaturesComponent } from './features/features.component';
import { ClientsComponent } from './clients/clients.component';
import { PlansComponent } from './plans/plans.component';
import { FooterComponent } from './footer/footer.component';
import { BuyTokensComponent } from './buy-tokens/buy-tokens.component';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { FormsModule } from '@angular/forms';

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
    UserDataFormComponent
  ],
  imports: [
    CommonModule
    , CarouselModule
    , FormsModule
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
