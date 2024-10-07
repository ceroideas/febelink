import { RouterModule, Routes } from '@angular/router'
import { environment } from '../environments/environment'
import { Registro2Component } from './pages/registro2/registro2.component'
import { SearchComponent } from './search/search.component'
import { NgModule } from '@angular/core'
import { Tab1Component } from './tab11/tab1.component'  
import { UseConditionsPage } from './pages/use-conditions/use-conditions.page'
import { LoBuscamosPorTiPage } from './pages/lo-buscamos-por-ti/lo-buscamos-por-ti.page'
import { PerfilOraculoPage } from './pages/perfil-oraculo/perfil-oraculo.page'

export const routes: Routes = [
 
      {
        path: '',
        component: Tab1Component,
        children: [
          
          // You can add more child routes for Tab1Component here if needed
        ],
      },
      { path: 'home', redirectTo: '', pathMatch: 'full' },


      // ESTAS SON LAS RUTAS PARA EL LISTADO PARA EL FILTRO
      {
        path: 'listado',
        component: SearchComponent
       
      },
      {
        path: 'listado/:searchTerm',
        component: SearchComponent
      },
      {
        path: 'servicios/:profession',
        component: SearchComponent
      },
      {
        path: 'servicios/:profession/:province',
        component: SearchComponent
      },
      {
        path: 'servicios/:profession/:province/:city',
        component: SearchComponent
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
        path: 'pedir-presupuesto-gratis',
        component: LoBuscamosPorTiPage
      },
      {
        path: 'pedir-presupuesto-gratis/:id',
        
        component: LoBuscamosPorTiPage
        
      },
      {
        path: 'createPassword/:token',
        loadChildren: () =>
          import('./pages/update-password/update-password.module').then((m) => m.UpdatePasswordPageModule),
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
        path: 'registro',
        component: Registro2Component,
      },
      {
        path: 'registro/:redirect',
        component: Registro2Component,
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
        path: 'olvidar-contrasena',
        loadChildren: () =>
          import('./pages/olvidar-contrasena/olvidar-contrasena.module').then(
            (m) => m.OlvidarContrasenaModule
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
          import('./tab3/tab3.module').then((m) => m.Tab3PageModule),
        // import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
      },
     
      {
        path: 'chat:roomId',
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
        component: UseConditionsPage
       
      },
      {
        path: 'cookie-policy',
        loadChildren: () =>
          import('./pages/cookie-policy/cookie-policy.module').then(
            (m) => m.CookiePolicyPageModule
          ),
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
    //   /**
    //    * Email Verified from mailbox
    //    */
      {
        path: 'email-verified/:id',
        loadChildren: () =>
          import('./pages/email-verified/email-verified.module').then(
            (m) => m.EmailVerifiedPageModule
          ),
      },
    //   // If no id, redirect to home
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
    //   {
    //     path: 'oracles',
    //     loadChildren: () =>
    //       import('./pages/posts/advises/advise.module').then(
    //         (m) => m.AdvisePageModule
    //       ),
    //   },
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
        component: PerfilOraculoPage
        // loadChildren: () =>
        //   import('./pages/perfil-oraculo/perfil-oraculo.module').then(
        //     (m) => m.PerfilOraculoPageModule
        //   ),
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
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'search/:searchTerm',
        component: SearchComponent
      },
   
]


@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class RoutesModule { }