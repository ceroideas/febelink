import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from 'src/app/services/http.service';
import {ProfessionType} from '../cuenta-profesional.page';

@Injectable({
  providedIn: 'root',
})

export class CuentaProfesionalService {
  constructor(
    private http: HttpService
  ) {
  }

  async getProfessionsByFilter(filterTerm: string) {
    return this.http.post('collections/profession/filter', {filterTerm});
  }

  async updateProfessions(professions: number[]) {
    return this.http.put('user/profession', {professions});
  }
}
