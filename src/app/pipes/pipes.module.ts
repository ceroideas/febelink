import { NgModule } from '@angular/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
import { DateFormatPipe } from './date-format';
import { SplitNumberPipe } from './split-number.pipe';
import { TypeofPipe } from './typeof.pipe';

@NgModule({
  declarations: [
      FilterPipe
    , SafeHtmlPipe
    , TypeofPipe
    , SplitNumberPipe
    , DateFormatPipe
  ],
  imports: [],
  exports: [
      FilterPipe
    , SafeHtmlPipe
    , TypeofPipe
    , SplitNumberPipe
    , DateFormatPipe
  ],
  entryComponents: [],
})
export class PipesModule {}
