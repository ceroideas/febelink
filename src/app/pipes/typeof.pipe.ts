import {Pipe, PipeTransform} from '@angular/core';

/**
 * Creé este Pipe para estar conciente
 * del typeof de los elementos desde el template
 *
 * @author abdias
 * @version 0.0.1
 *
 * @interface
 */
@Pipe({
  name: 'typeof'
})
export class TypeofPipe implements PipeTransform {

  transform(value: any): any {
    return this.checkTypeOf( value );
  }

  checkTypeOf( value: any ) {
    if( value === undefined )
      return 'undefined';

    if( value === null )
      return 'null';

    if( Array.isArray( value ))
      // Si tiene items => Entrar en el loop con el item 0 || return 'array'
      return value.length === 0 ? 'array' : this.typeOfinArray( value);

    return typeof value;
  }

  /**
   * Intenta devolver el tipo general de items que hay
   */
  typeOfinArray( array:any ) {
    let typeofs = [];

    for( let i = 0; i < array.length; i++ ) {
      // Añadir typeof solo si no ha sido añadido previamente
      if( typeofs.indexOf( typeof array[ 0 ] ) === -1 )
        typeofs.push( typeof array[ 0 ] );
      
      // Si hay mas de 1 typeof dentro del listado, entonces no hay un tipo generico
      if( typeofs.length > 1 )
        break;
    }

    switch( typeofs.length ) {
      case 0:   // Array vacío
        return '[]';
      case 1:   // Devolver el tipo de item general del listado
        return typeofs[ 0 ] + '[]';
      default:  // Array de multiples tipos
        return 'object[]';
    }
  }
}