import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { ImgErrorFallbackDirective } from '../directives/img-error-fallback.directive';


@NgModule({
    declarations: [FilterPipe, ImgErrorFallbackDirective],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule.forChild(),
    ],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, TranslateModule, FilterPipe, ImgErrorFallbackDirective],
    entryComponents: []
})
export class SharedModule { }