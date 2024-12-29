
import {Injectable} from '@angular/core';

import { HttpService, IHttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ShadowUsersService {

  constructor(
    private http: HttpService
  ) {
  }

  async create(data: any): Promise<IHttpService> {
    return this.http.post('shadowUser', data);
  }

  async delete(id: number): Promise<IHttpService> {
    return this.http.delete(`shadowUser/${id}`);
  }

  async update(data: any): Promise<IHttpService> {
    return this.http.put(`shadowUser`, data);
  }

  async get(): Promise<IHttpService> {
    return this.http.get('shadowUser');
  }
}
