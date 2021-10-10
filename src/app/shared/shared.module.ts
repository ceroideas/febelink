import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { ImgErrorFallbackDirective } from '../directives/img-error-fallback.directive';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { FooterComponent } from '../components/footer/footer.component';


@NgModule({
    declarations: [
        FilterPipe
        , ImgErrorFallbackDirective
        , HeaderButtonsComponent
        , FooterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule.forChild(),
    ],
    exports: [
        CommonModule
        , FormsModule
        , ReactiveFormsModule
        , IonicModule
        , TranslateModule
        , FilterPipe
        , ImgErrorFallbackDirective
        , HeaderButtonsComponent
        , FooterComponent
    ],
    entryComponents: []
})
export class SharedModule { }