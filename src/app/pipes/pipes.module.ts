import { NgModule } from '@angular/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
import { SplitNumberPipe } from './split-number.pipe';
import { TypeofPipe } from './typeof.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    SafeHtmlPipe,
    TypeofPipe,
    SplitNumberPipe,
  ],
  imports: [],
  exports: [
    FilterPipe,
    SafeHtmlPipe,
    TypeofPipe,
    SplitNumberPipe,
  ],
  entryComponents: [],
})
export class PipesModule {}
