import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'oracles', pathMatch: 'full' },

  /* Advises List */
  {
    path: 'oraculo',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
  {
    path: 'oraculos',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
  {
    path: 'oracle',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
  {
    path: 'oracles',
    loadChildren: () => import('./advises/advise.module').then( m => m.AdvisePageModule )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPageRoutingModule {}
