import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'menu/todas', pathMatch: 'full'},
    {
        path: 'menu',
        loadChildren: () =>
            import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'perfil-demandante/:id',
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
        path: 'demanda/:id',
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
        path: 'sesion-ctrl',
        loadChildren: () =>
            import('./pages/sesion-ctrl/sesion-ctrl.module').then(
                (m) => m.SesionCtrlPageModule
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
        loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
    }

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
