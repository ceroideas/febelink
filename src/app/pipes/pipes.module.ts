import { NgModule } from '@angular/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { SplitNumberPipe } from './split-number.pipe';
import { StringToNumberPipe } from './str-to-num.pipe';
import { TypeofPipe } from './typeof.pipe';
import { DateAgoPipe } from './date-ago.pipe';

@NgModule({
    declarations: [
        FilterPipe,
        SafeHtmlPipe,
        TypeofPipe,
        SplitNumberPipe,
        DateFormatPipe,
        StringToNumberPipe,
        DateAgoPipe
    ],
    imports: [],
    exports: [
        FilterPipe,
        SafeHtmlPipe,
        TypeofPipe,
        SplitNumberPipe,
        DateFormatPipe,
        StringToNumberPipe,
        DateAgoPipe
    ]
})
export class PipesModule {}
