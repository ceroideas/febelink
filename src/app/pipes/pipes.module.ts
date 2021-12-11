import { NgModule } from '@angular/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
import { TypeofPipe } from './typeof.pipe';

@NgModule({
  declarations: [
    FilterPipe,
    SafeHtmlPipe,
    TypeofPipe,
  ],
  imports: [],
  exports: [
    FilterPipe,
    SafeHtmlPipe,
    TypeofPipe,
  ],
  entryComponents: [],
})
export class PipesModule {}
