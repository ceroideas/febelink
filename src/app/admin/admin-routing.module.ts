import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AdminPage} from './admin.page';

import { SectorsComponent } from './sectors/sectors.component';
import { SubsectorsComponent } from './subsectors/subsectors.component';
import { ProvincesComponent } from './provinces/provinces.component';
import { CitiesComponent } from './cities/cities.component';
import { ClicksComponent } from './clicks/clicks.component';
import { FooterLinksComponent } from './footer-links/footer-links.component';

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
      { path: 'footer-links', component: FooterLinksComponent }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {
}
