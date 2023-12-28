import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from 'src/app/services/http.service';
import {IServiceFull} from '../models/services.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(private http: HttpService) {
  }

  // To Get All Products
  async get(): Promise<IHttpService> {
    return this.http.get('product');
  }

  // To Get a Product
  async getProduct(id: number): Promise<IHttpService> {
    return this.http.get('product/' + id);
  }

  // To Create a Product
  async create(product: IServiceFull): Promise<IHttpService> {
    return this.http.post('product/create', product);
  }

  // To Update a Product
  async update(product: IServiceFull): Promise<IHttpService> {
    return this.http.post('product/update', product);
  }

  // To Finish a Product
  async finish(product: IServiceFull): Promise<IHttpService> {
    return this.http.post('product/finish', product);
  }

  // To Cancel a Product
  async cancel(product: IServiceFull): Promise<IHttpService> {
    return this.http.post('product/cancel', product);
  }

  // To Get All Professions
  async professions(): Promise<IHttpService> {
    return this.http.get('collections/profession');
  }

  // To Get My Professions
  async userProfession(): Promise<IHttpService> {
    return this.http.get('user/profession');
  }

  // Remove my Product by productId
  async removeProduct(productId: string): Promise<IHttpService> {
    return this.http.delete('product/' + productId);
  }
}
