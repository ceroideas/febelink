import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OlvidarContrasenaComponent } from './olvidar-contrasena.component';


const routes: Routes = [
  {
    path: '',
    component: OlvidarContrasenaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlvidarContrasenaPageRoutingModule {}
