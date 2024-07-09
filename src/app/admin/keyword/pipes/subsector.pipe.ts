import {Pipe, PipeTransform} from '@angular/core';
import {ISubSector} from '../../../models/sector.model';

@Pipe({
  name: 'subSector'
})
export class SubSectorPipe implements PipeTransform {

  transform(id: number, sectors: ISubSector[]): string {
    if (!id || !sectors || sectors.length === 0) {
        return '';
    }
    
    const subsector = sectors.find(subsector => subsector.id === id);
    if (subsector) {
        return subsector.nombre;
    } else {
        return ''; // or handle the case when subsector is undefined
    }
  }

}
