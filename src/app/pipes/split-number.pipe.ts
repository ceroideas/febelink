import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitNumber'
})
export class SplitNumberPipe implements PipeTransform {

  
  transform( value: string | number, returnDecimal: boolean = true ) {
    const entero = Math.floor( Number( value || 0 ));

    let decimal: string = (( value || '0.0' ) + '' ).replace( ',', '.' );
    decimal = decimal?.split( '.' )?.length > 0 ? decimal.split( '.' )[ 1 ] : '0';

    return returnDecimal ? decimal : entero;
  }
}
