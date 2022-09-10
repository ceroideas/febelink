import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TabsPage} from 'src/app/tabs/tabs.page';
import {environment} from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {path: '', redirectTo: 'oracles', pathMatch: 'full'},

      /* Oracles List */
      {
        path: 'oraculos',
        loadChildren: () => import('./advises/advise.module').then(m => m.AdvisePageModule)
      },
      {
        path: 'oracles',
        loadChildren: () => import('./advises/advise.module').then(m => m.AdvisePageModule)
      },

      // Redirect Tabs when clicked
      {path: 'search', redirectTo: '/search', pathMatch: 'prefix'},
      {path: 'cart', redirectTo: '/cart', pathMatch: 'prefix'},
      {path: 'busquedas', redirectTo: '/menu/busquedas', pathMatch: 'prefix'},
      {path: 'ofertas', redirectTo: '/menu/ofertas', pathMatch: 'prefix'},
      {path: 'perfil', redirectTo: '/menu/perfil', pathMatch: 'prefix'},
      {path: 'welcome', redirectTo: '/menu/welcome', pathMatch: 'prefix'},
      {path: 'notificaciones', redirectTo: '/menu/notificaciones', pathMatch: 'prefix'},
    ]
  },

  // Individual Oracle
  {
    path: 'oraculo',
    loadChildren: () => import('./advises/advise.module').then(m => m.AdvisePageModule)
  },
  {
    path: 'oracle',
    loadChildren: () => import('./advises/advise.module').then(m => m.AdvisePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPageRoutingModule {
}
