import { NgModule } from '@angular/core';
import { AdminPageRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminPage } from './admin.page';
import { SharedModule } from '../shared/shared.module';

import { LucideAngularModule, MousePointerClick, Map, MapPin, Factory, Briefcase, BriefcaseBusiness, Link, Wallet, Pencil, Trash2, Image, ArrowDownToDot, Plus, Square, SquareCheck, X, FileDown, FileUp, ArrowUpRight, Globe, Eye, UsersRound } from 'lucide-angular';

import { SectorsComponent } from './sectors/sectors.component';
import { SubsectorsComponent } from './subsectors/subsectors.component';
import { ProvincesComponent } from './provinces/provinces.component';
import { CitiesComponent } from './cities/cities.component';
import { ClicksComponent } from './clicks/clicks.component';
import { FooterLinksComponent } from './footer-links/footer-links.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { ShadowUsersComponent } from './shadow-users/shadow-users.component';
import { ShadowProductsComponent } from './shadow-products/shadow-products.component';
import { AutomationsComponent } from './automations/automations.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrompsComponent } from './promps/promps.component';


@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    AdminPageRoutingModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({MousePointerClick, Map, MapPin, Factory, Briefcase, BriefcaseBusiness, Link, Wallet, Pencil, Trash2, Image, ArrowDownToDot, Plus, Square, SquareCheck, X, FileDown, FileUp, ArrowUpRight, Globe, Eye, UsersRound}),
  ],
  declarations: [
    AdminPage, 
    SectorsComponent, 
    SubsectorsComponent,
    ProvincesComponent,
    CitiesComponent,
    ClicksComponent,
    FooterLinksComponent,
    BudgetsComponent,
    ShadowUsersComponent,
    ShadowProductsComponent,
    AutomationsComponent,
    NotificationsComponent,
    PrompsComponent,
  ]
})
export class AdminPageModule {}
