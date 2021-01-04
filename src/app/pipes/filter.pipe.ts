import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /*
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
  */

  transform(items: any[], search: string) {
    console.log('items', items);
    if ((items.length !== 0) && (search)) {
        return items.filter( item  => item?.nombre ? (item.nombre.toLowerCase().indexOf(search.toLowerCase()) > -1) :
        (item.descripcion.toLowerCase().indexOf(search.toLowerCase()) > -1));
    }
    return items;
  }

}
