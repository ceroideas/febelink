import { NgModule } from '@angular/core';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  { path: '', redirectTo: 'posts/oracles', pathMatch: 'full' },
  {
    path: 'menu',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'user/:recommenderId',
    loadChildren: () =>
      import('./tab1/tab1.module').then((m) => m.Tab1PageModule),
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
  {
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
  },
  {
    path: 'busquedas',
    loadChildren: () =>
      import('./pages/busquedas/busquedas.module').then(
        (m) => m.BusquedasPageModule
      ),
  },
  {
    path: 'editar-demanda',
    loadChildren: () =>
      import('./pages/editar-demanda/editar-demanda.module').then(
        (m) => m.EditarDemandaPageModule
      ),
  },
  {
    path: 'publicar-demanda',
    loadChildren: () =>
      import('./pages/publicar-demanda/publicar-demanda.module').then(
        (m) => m.PublicarDemandaPageModule
      ),
  },
  {
    path: 'suscribirse',
    loadChildren: () =>
      import('./pages/suscribirse/suscribirse.module').then(
        (m) => m.SuscribirsePageModule
      ),
  },
  {
    path: 'interior-oferta',
    loadChildren: () =>
      import('./pages/interior-oferta/interior-oferta.module').then(
        (m) => m.InteriorOfertaPageModule
      ),
  },
  {
    path: 'ofertantes',
    loadChildren: () =>
      import('./pages/ofertantes/ofertantes.module').then(
        (m) => m.OfertantesPageModule
      ),
  },
  {
    path: 'publicar-opinion',
    loadChildren: () =>
      import('./pages/publicar-opinion/publicar-opinion.module').then(
        (m) => m.PublicarOpinionPageModule
      ),
  },
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
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
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
    loadChildren: () => import('./pages/success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/success/success.module').then( m => m.SuccessPageModule)
  },
  /**
   * Email Verified from mailbox
   */
  {
    path: 'email-verified/:id',
    loadChildren: () => import('./pages/email-verified/email-verified.module').then( m => m.EmailVerifiedPageModule)
  },
  // If no id, redirect to home
  {
    path: 'email-verified', redirectTo: environment.HOME_PAGE, pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/post.module').then( m => m.PostPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'cart-history',
    loadChildren: () => import('./pages/cart-history/cart-history.module').then( m => m.CartHistoryPageModule)
  },
  {
    path: 'cart/success',
    loadChildren: () => import('./pages/cart-success/cart-success.module').then( m => m.CartSuccessPageModule)
  },
  {
    path: 'cart/error',
    loadChildren: () => import('./pages/cart-error/cart-error.module').then( m => m.CartErrorPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

  constructor(private router: Router) {
    /**
     * To prevent 'Error: Cannot match any routes' when wrong url
     
    this.router.errorHandler = (error: any) => {
      // Redirect to Main Page | Home Page
      this.router.navigate([ '/' + environment.HOME_PAGE ]);
    }*/
  }
}

