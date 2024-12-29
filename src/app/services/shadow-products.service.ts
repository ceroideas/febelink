
import {Injectable} from '@angular/core';

import { HttpService, IHttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ShadowProductsService {

  constructor(
    private http: HttpService
  ) {
  }

  async create(data: any): Promise<IHttpService> {
    return this.http.post('shadowUser/product', data);
  }

  async delete(id: number): Promise<IHttpService> {
    return this.http.delete(`shadowUser/product/${id}`);
  }

  async update(data: any): Promise<IHttpService> {
    return this.http.put(`shadowUser/product`, data);
  }

  async get(): Promise<IHttpService> {
    return this.http.get('shadowUser/product');
  }
}
