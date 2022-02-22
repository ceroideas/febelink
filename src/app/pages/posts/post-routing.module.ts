import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'advises', pathMatch: 'full' },

  /* Advises List */
  {
    path: 'consejo',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
  {
    path: 'consejos',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
  {
    path: 'advise',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
  {
    path: 'advises',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPageRoutingModule {}
