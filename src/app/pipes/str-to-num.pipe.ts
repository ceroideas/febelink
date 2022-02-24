import { Pipe, PipeTransform } from '@angular/core';

export enum NumberType {
  Float
, Number
}

@Pipe({
  name: 'str2num'
})
export class StringToNumberPipe implements PipeTransform {
  
  transform( value: string | number, numType: NumberType = NumberType.Float ) {
    if( !value ) return 0;

    switch( numType ) {
      case NumberType.Float:
        return parseFloat( value + '' );
      case NumberType.Number:
        return Number( value );
    }
  }
}
