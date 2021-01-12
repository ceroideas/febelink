import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPipe } from '../pipes/filter.pipe';


@NgModule({
    declarations: [FilterPipe],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule.forChild(),
    ],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, TranslateModule, FilterPipe],
    entryComponents: []
})
export class SharedModule { }