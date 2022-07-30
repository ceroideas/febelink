import {Pipe, PipeTransform} from '@angular/core';
import {ISector} from '../../../models/sector.model';

@Pipe({
  name: 'sector'
})
export class SectorPipe implements PipeTransform {

  transform(id: number, sectors: ISector[]): string {
    if (!id) {
      return '';
    }
    return sectors.find(sector => sector.id === id).nombre;
  }

}
