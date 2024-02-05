import {Pipe, PipeTransform} from '@angular/core';
import {ISector} from '../../../models/sector.model';

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {

  transform(id: number, location: ISector[]): string {
    if (!id) {
      return '';
    }
    return location.find(location => location.id === id).nombre;
  }

}
