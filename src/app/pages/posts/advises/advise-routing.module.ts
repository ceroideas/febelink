import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvisesPage } from './advises/advises.page';
import { AdvisePage } from './advise/advise.page';
import { AdviseCRUDPage } from './advise-crud/advise-crud.page';

const routes: Routes = [
  /* Lists */
    { path: '', component: AdvisesPage }
  , { path: 'oraculos', component: AdvisesPage }
  , { path: 'oracles', component: AdvisesPage }

  /* Create */
  , { path: 'create', component: AdviseCRUDPage }
  , { path: 'crear', component: AdviseCRUDPage }

  /* Read */
  , { path: ':id', component: AdvisePage }
  , { path: ':id/:title', component: AdvisePage }
  /* Update | Edit | Delete */
  , { path: ':id/edit', component: AdviseCRUDPage }
  , { path: ':id/:title/edit', component: AdviseCRUDPage }
  , { path: ':id/editar', component: AdviseCRUDPage }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvisePageRoutingModule {}
