import { NgModule } from '@angular/core';
import { AdminPageRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';

import { AdminPage } from './admin.page';
import { SharedModule } from '../shared/shared.module';

import { LucideAngularModule, MousePointerClick, Map, MapPin, Factory, BriefcaseBusiness, Link, Wallet, Pencil, Trash2, Image, ArrowDownToDot, Plus, Square, SquareCheck, X, FileDown, FileUp, ArrowUpRight, Globe, Eye } from 'lucide-angular';

import { SectorsComponent } from './sectors/sectors.component';
import { SubsectorsComponent } from './subsectors/subsectors.component';
import { ProvincesComponent } from './provinces/provinces.component';
import { CitiesComponent } from './cities/cities.component';
import { ClicksComponent } from './clicks/clicks.component';
import { FooterLinksComponent } from './footer-links/footer-links.component';
import { BudgetsComponent } from './budgets/budgets.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    AdminPageRoutingModule,
    LucideAngularModule.pick({MousePointerClick, Map, MapPin, Factory, BriefcaseBusiness, Link, Wallet, Pencil, Trash2, Image, ArrowDownToDot, Plus, Square, SquareCheck, X, FileDown, FileUp, ArrowUpRight, Globe, Eye}),
  ],
  declarations: [
    AdminPage, 
    SectorsComponent, 
    SubsectorsComponent,
    ProvincesComponent,
    CitiesComponent,
    ClicksComponent,
    FooterLinksComponent,
    BudgetsComponent
  ]
})
export class AdminPageModule {}
