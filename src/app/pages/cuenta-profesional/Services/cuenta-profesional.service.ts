import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from './../../../services/http.service';
import { ProfessionType } from '../cuenta-profesional.page';

@Injectable({
  providedIn: 'root',
})
export class CuentaProfesionalService {
  constructor(private http: HttpService) {}

  async getMyProfessions() {
    return this.http.get('user/profession');
  }

  async getProfessionsByFilter(filterTerm: string) {
    return this.http.post('collections/profession/filter', { filterTerm });
  }

  async updateProfessions(professions: ProfessionType[], locations: any[]) {
    return this.http.put('user/profession', {
      professions: JSON.stringify(professions),
      locations: JSON.stringify(locations),
    });
  }
}
