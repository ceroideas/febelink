import {Pipe, PipeTransform} from '@angular/core';
import {ISector} from '../../../models/sector.model';

@Pipe({
  name: 'sector'
})
export class SectorPipe implements PipeTransform {

  transform(id: number, sectors: ISector[]): string {
    if (!id || !sectors || sectors.length === 0) {
      return '';
    }
    
    const foundSector = sectors.find(sector => sector.id === id);
    if (foundSector) {
        return foundSector.nombre;
    } else {
        return ''; // or handle the case when no sector is found
    }
  }

}
