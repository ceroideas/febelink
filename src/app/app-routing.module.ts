import {NgModule} from '@angular/core';
import {
  PreloadAllModules,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import {environment} from 'src/environments/environment';

import { Tab1Page } from './tab1/tab1.page';
import { SearchPage } from './search/search.page';
import { LoBuscamosPorTiPage } from './pages/lo-buscamos-por-ti/lo-buscamos-por-ti.page';
import { UpdatePasswordPage } from './pages/update-password/update-password.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page
  },
  {
    path: 'listado',
    component: SearchPage
  },
  {
    path: 'listado/:searchTerm',
    component: SearchPage
  },
  {
    path: 'user/:recommenderId',
    loadChildren: () =>
      import('./tab1/tab1.module').then((m) => m.Tab1PageModule),
  },
  {
    path: 'links',
    loadChildren: () =>
      import('./pages/links/links.module').then(
        (m) => m.InterestingLinksPageModule
      ),
  },
  {
    path: 'search',
    component: SearchPage
  },
  {
    path: 'search/:searchTerm',
    component: SearchPage
  },
  {
    path: 'lo-buscamos-por-ti',
    component: LoBuscamosPorTiPage
    // loadChildren: () => 
      // import('./pages/lo-buscamos-por-ti/lo-buscamos-por-ti.module').then((m) => m.LoBuscamosPorTiPageModule),
  },
  {
    path: 'createPassword/:token',
    component: UpdatePasswordPage
    // loadChildren: () =>
      // import('./pages/update-password/update-password.module').then((m) => m.UpdatePasswordPageModule),
  },
  
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'login/:redirect',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'perfil/:id',
    loadChildren: () =>
      import('./pages/perfil-demandante/perfil-demandante.module').then(
        (m) => m.PerfilDemandantePageModule
      ),
  },
  {
    path: 'perfil/:id/:name',
    loadChildren: () =>
      import('./pages/perfil-demandante/perfil-demandante.module').then(
        (m) => m.PerfilDemandantePageModule
      ),
  },
  {
    path: 'olvidar-contrasena',
    loadChildren: () =>
      import('./pages/olvidar-contrasena/olvidar-contrasena.module').then(
        (m) => m.OlvidarContrasenaPageModule
      ),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./pages/registro/registro.module').then(
        (m) => m.RegistroPageModule
      ),
  },
  {
    path: 'registro/:redirect',
    loadChildren: () =>
      import('./pages/registro/registro.module').then(
        (m) => m.RegistroPageModule
      ),
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./pages/terms/terms.module').then((m) => m.TermsPageModule),
  },
  {
    path: 'guide',
    loadChildren: () =>
      import('./pages/guide/guide.module').then((m) => m.GuidePageModule),
  },
  /*{
    path: 'busqueda/:id',
    loadChildren: () =>
      import('./pages/detalle-demanda/detalle-demanda.module').then(
        (m) => m.DetalleDemandaPageModule
      ),
  },
  {
    path: 'busqueda/:id/:name',
    loadChildren: () =>
      import('./pages/detalle-demanda/detalle-demanda.module').then(
        (m) => m.DetalleDemandaPageModule
      ),
  },*/
  {
    path: 'acerca-de',
    loadChildren: () =>
      import('./pages/acerca-de/acerca-de.module').then(
        (m) => m.AcercaDePageModule
      ),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./tab3/tab3.module').then((m) => m.Tab3PageModule),
    // import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./pages/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyPageModule
      ),
  },
  {
    path: 'legal-disclaimer',
    loadChildren: () =>
      import('./pages/legal-disclaimer/legal-disclaimer.module').then(
        (m) => m.LegalDisclaimerPageModule
      ),
  },
  {
    path: 'use-conditions',
    loadChildren: () =>
      import('./pages/use-conditions/use-conditions.module').then(
        (m) => m.UseConditionsPageModule
      ),
  },
  {
    path: 'cookie-policy',
    loadChildren: () =>
      import('./pages/cookie-policy/cookie-policy.module').then(
        (m) => m.CookiePolicyPageModule
      ),
  },
  {
    path: 'token',
    loadChildren: () =>
      import('./landing/pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'wallet/buy-tokens/:currency',
    loadChildren: () =>
      import('./pages/wallet/wallet.module').then((m) => m.WalletPageModule),
  },
  {
    path: 'wallet',
    loadChildren: () =>
      import('./pages/wallet/wallet.module').then((m) => m.WalletPageModule),
  },
  {
    path: 'success/:ref',
    loadChildren: () =>
      import('./pages/success/success.module').then((m) => m.SuccessPageModule),
  },
  {
    path: 'success',
    loadChildren: () =>
      import('./pages/success/success.module').then((m) => m.SuccessPageModule),
  },
  /**
   * Email Verified from mailbox
   */
  {
    path: 'email-verified/:id',
    loadChildren: () =>
      import('./pages/email-verified/email-verified.module').then(
        (m) => m.EmailVerifiedPageModule
      ),
  },
  // If no id, redirect to home
  {
    path: 'email-verified',
    redirectTo: environment.HOME_PAGE,
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminPageModule),
  },
  {
    path: 'oracles',
    loadChildren: () =>
      import('./pages/posts/advises/advise.module').then(
        (m) => m.AdvisePageModule
      ),
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./pages/posts/post.module').then((m) => m.PostPageModule),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./pages/cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./pages/servicios/servicios.module').then(
        (m) => m.ServiciosPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/user-data/user-data.module').then(
        (m) => m.UserDataPageModule
      ),
  },
  {
    path: 'profile/account',
    loadChildren: () =>
      import('./pages/user-data-personal/user-data-personal.module').then(
        (m) => m.UserDataPersonalPageModule
      ),
  },
  {
    path: 'cart/history',
    loadChildren: () =>
      import('./pages/cart-history/cart-history.module').then(
        (m) => m.CartHistoryPageModule
      ),
  },
  {
    path: 'cart/success',
    loadChildren: () =>
      import('./pages/cart-success/cart-success.module').then(
        (m) => m.CartSuccessPageModule
      ),
  },
  {
    path: 'cart/error',
    loadChildren: () =>
      import('./pages/cart-error/cart-error.module').then(
        (m) => m.CartErrorPageModule
      ),
  },
  {
    path: 'user/:username/detail/:id',
    loadChildren: () =>
      import('./pages/perfil-oraculo/perfil-oraculo.module').then(
        (m) => m.PerfilOraculoPageModule
      ),
  },
  {
    path: 'profile/public',
    loadChildren: () =>
      import('./pages/mis-publicaciones/mis-publicaciones.module').then(
        (m) => m.MisPublicacionesPageModule
      ),
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('./pages/suscripciones/suscripciones.module').then(
        (m) => m.SuscripcionesPageModule
      ),
  },
  {
    path: 'servicio/:title/detail/:id',
    loadChildren: () =>
      import('./pages/detalle-busqueda/detalle-busqueda.module').then(
        (m) => m.DetalleBusquedaPageModule
      ),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notifications-log/notifications-log.module').then(
        (m) => m.NotificationsLogPageModule
      ),
  },
  {
    path: 'professions',
    loadChildren: () =>
      import('./pages/cuenta-profesional/cuenta-profesional.module').then(
        (m) => m.CuentaProfesionalPageModule
      ),
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    /**

     this.router.errorHandler = (error: any) => {
      // Redirect to Main Page | Home Page
      this.router.navigate([ '/' + environment.HOME_PAGE ]);
    }*/
  }
}
