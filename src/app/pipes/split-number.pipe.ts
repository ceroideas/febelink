import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitNumber'
})
export class SplitNumberPipe implements PipeTransform {

  
  transform({ value, returnDecimal = false, round = false }: { value?: string | number, returnDecimal?: boolean, round?: boolean | number}) {
    const entero = Math.floor( Number( value || 0 ));

    let decimal: string = (( value || '0.0' ) + '' ).replace( ',', '.' );
    decimal += decimal.includes( '.' ) ? '' : '.0';
    decimal = ( !round ? decimal : parseFloat( decimal ).toFixed( Number( round )).toString() )
        .split( '.' )[ 1 ];

    return returnDecimal ? decimal : entero;
  }
}
