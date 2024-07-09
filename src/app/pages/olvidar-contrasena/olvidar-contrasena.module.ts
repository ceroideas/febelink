import { NgModule } from '@angular/core';

import { OlvidarContrasenaComponent } from './olvidar-contrasena.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './../../shared/shared.module';
import { OlvidarContrasenaPageRoutingModule } from './olvidar-contrasena-routing.module';


@NgModule({
  imports: [
    SharedModule,
    OlvidarContrasenaPageRoutingModule
  ],
  declarations: [OlvidarContrasenaComponent],
  exports: [ TranslateModule ],
})
export class OlvidarContrasenaModule {}
