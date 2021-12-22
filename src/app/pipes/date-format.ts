import { Pipe, PipeTransform } from '@angular/core';
import { TranslateConfigService } from '../services/translate/translate-config.service';

export enum DateFormatType {
  Date
}
export enum MonthFormatType {
    Number
  , Short
  , Long
}

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  constructor(
    private translateSvc: TranslateConfigService
  ) {}
  
  transform( value: string, type: DateFormatType, monthFormat: MonthFormatType = MonthFormatType.Short ) {
    try {
      const date = new Date( value );
      const day = date.getDate();
      const year = date.getFullYear();
      let month;
      switch( monthFormat ) {
        case MonthFormatType.Number:
          month = '-' + ( date.getMonth() + 1 ) + '-';
          break;
        case MonthFormatType.Short:
          month = ' ' + this.translateSvc.instant( 'common.months.' + date.getMonth() + '.short' ) + ' ';
          break;
        case MonthFormatType.Long:
          month =  ' ' + this.translateSvc.instant( 'common.months.' + date.getMonth() + '.long' ) + ' ';
          break;
      } 

      switch( type ) {
        case DateFormatType.Date:
          value = day + month + year + '';
          break;
      }

      return value;
    } catch( err ) {
      return value;
    }
  }
}
