import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  constructor(
      private http: HttpService
  ) {}

  // To Get Active Cart
  async get(): Promise<IHttpService>
  {
    return this.http.get( 'cart' )
  }

  // To Update Products Cart
  async update( productId: number, productAmount: number ): Promise<IHttpService>
  {
    return this.http.put( 'cart/update', { productId, productAmount } )
  }

  // To Get Active Cart
  async buy(): Promise<IHttpService>
  {
    return this.http.get( 'cart/buy' )
  }

  // To Get Cart History
  async history(): Promise<IHttpService>
  {
    return this.http.get( 'cart/history' )
  }
}
