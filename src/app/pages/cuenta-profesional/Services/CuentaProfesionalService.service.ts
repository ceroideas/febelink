import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from 'src/app/services/http.service';

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
}
