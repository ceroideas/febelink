import {Pipe, PipeTransform} from '@angular/core';
import {ISector} from '../../../models/sector.model';

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {

  transform(id: number, location: ISector[]): string {
    if (!id || !location || location.length === 0) {
        return '';
    }
    
    const foundLocation = location.find(location => location.id === id);
    if (foundLocation) {
        return foundLocation.nombre;
    } else {
        return ''; // or handle the case when no location is found
    }
    
  }

}
