import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { ImgErrorFallbackDirective } from '../directives/img-error-fallback.directive';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { FooterComponent } from '../components/footer/footer.component';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { LangPopComponent } from 'src/app/components/langs/popover/pop.component';

@NgModule({
  declarations: [
    FilterPipe,
    ImgErrorFallbackDirective,
    HeaderButtonsComponent,
    LangBtnComponent,
    LangPopComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FilterPipe,
    ImgErrorFallbackDirective,
    HeaderButtonsComponent,
    LangBtnComponent,
    LangPopComponent,
  ],
  entryComponents: [],
})
export class SharedModule {}
