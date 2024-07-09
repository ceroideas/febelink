import {Injectable} from '@angular/core';
import { HttpService, IHttpService } from './http.service';
import { ISearchFull } from '../pages/lo-buscamos-por-ti/models/lo-buscamos-por-ti.model';

@Injectable({
  providedIn: 'root'
})
export class SearchforyouService {

  constructor(
    private http: HttpService
  ) {
  }

  async create(seacrh: ISearchFull): Promise<IHttpService> {
    return this.http.post('findService', seacrh);
  }
}
