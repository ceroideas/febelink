import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedGuard } from '../guards/is-logged.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'todas',
        pathMatch: 'full',
      },
      {
        path: 'todas',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'todas/:searchbar',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'busquedas',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'advises',
        redirectTo: '/posts/advises',
        pathMatch: 'prefix',
        loadChildren: () =>
          import( '../pages/posts/advises/advise.module' ).then(( m ) => m.AdvisePageModule ),
      },
      {
        path: 'ofertas',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../tab4/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: 'welcome',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('../pages/notifications-log/notifications-log.module').then( m => m.NotificationsLogPageModule),
        canActivate: [ IsLoggedGuard ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
