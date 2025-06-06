import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AdminPage} from './admin.page';

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

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'tokens-users',
        loadChildren: () => import('./tokens-users/tokens-users.module').then(m => m.TokensUsersPageModule)
      }, 
      {
        path: 'keyword',
        loadChildren: () => import('./keyword/keyword.module').then(m => m.KeywordPageModule)
      },
      { path: 'sectors', component: SectorsComponent },
      { path: 'subsectors', component: SubsectorsComponent },
      { path: 'provinces', component: ProvincesComponent },
      { path: 'cities', component: CitiesComponent },
      { path: 'clicks', component: ClicksComponent },
      { path: 'footer-links', component: FooterLinksComponent },
      { path: 'budget', component: BudgetsComponent },
      { path: 'shadow-users', component: ShadowUsersComponent },
      { path: 'shadow-products', component: ShadowProductsComponent },
      { path: 'automations', component: AutomationsComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {
}
