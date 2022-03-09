import { Pipe, PipeTransform } from '@angular/core';
import { TranslateConfigService } from '../services/translate/translate-config.service';

export enum DateFormatType {
    Date
  , TimeDate
  , DateTime
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
    if( !value )
      return '';
    
    try {
      const date = new Date( value.replace( '-', '/' ));
      const day = date.getDate();
      const year = date.getFullYear();
      let month;
      switch( monthFormat ) {
        case MonthFormatType.Number:
          month = '-' + ("00" + ( date.getMonth() + 1 )).slice(-2) + '-';
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
          value = ("00" + day ).slice(-2) + month + year + '';
          break;
        case DateFormatType.TimeDate:
        case DateFormatType.DateTime:
          const hour =  ("00" + date.getHours() ).slice(-2);
          const minutes = ("00" + date.getMinutes()).slice(-2);
          value = type == DateFormatType.TimeDate
            ? hour + ':' + minutes + ' hs - ' + day + month + year + ''
            : day + month + year + ' - ' + hour + ':' + minutes + ' hs';
          break;
      }

      return value;
    } catch( err ) {
      return value;
    }
  }
}
