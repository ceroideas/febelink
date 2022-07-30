import {Pipe, PipeTransform} from '@angular/core';
import {ISubSector} from '../../../models/sector.model';

@Pipe({
  name: 'subSector'
})
export class SubSectorPipe implements PipeTransform {

  transform(id: number, sectors: ISubSector[]): string {
    if (!id) {
      return '';
    }
    return sectors.find(subsector => subsector.id === id).nombre;
  }

}
