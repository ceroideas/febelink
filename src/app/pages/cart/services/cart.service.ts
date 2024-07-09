import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from '../../../services/http.service';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {Subject} from 'rxjs';
import {CartServiceShow} from '../../../services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  activeCart: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpService,
    private authenticationService: AuthenticationService,
    private cartServiceShow: CartServiceShow // TODO: UNIFY AND REMOVE THIS HANDLER!!
  ) {
  }

  setActiveCart(newCartState: any) {
    this.activeCart.next(newCartState);
    this.cartServiceShow.isToggleCart = true;
  }

  getActiveCart() {
    return this.activeCart;
  }

  // To Get Active Cart
  async getFindServices(): Promise<IHttpService> {
    return this.http.get('getFindServices');
  }
  // To Get Active Cart
  async getFindService(id: any): Promise<IHttpService> {
    return this.http.get('getFindService/'+id);
  }
  

   // To Get Active Cart
   async get(): Promise<IHttpService> {
    return this.http.get('cart');
  }

  // To Update Products Cart
  async update(productId: number, productAmount: number): Promise<IHttpService> {
    return this.http.put('cart/update', {productId, productAmount});
  }

  // To Get Active Cart
  async buy(): Promise<IHttpService> {
    return this.http.get(this.authenticationService.isAuthenticated() ? 'cart/buy' : 'cart/guest/buy');
  }

  // To Get Cart History
  async history(): Promise<IHttpService> {
    return this.http.get('cart/history');
  }

  // BuyNow
  async buyNow(productId: number, productAmount: number, email: string): Promise<IHttpService> {
    return this.http.post(this.authenticationService.isAuthenticated() ? 'cart/buyNow' : 'cart/guest/buyNow', {
      productId,
      productAmount,
      email
    });
  }

  async addProductToActiveCart(productId: any, productAmount: any) {
    return this.http.post(this.authenticationService.isAuthenticated() ? 'cart/add' : 'cart/guest/add', {productId, productAmount});
  }
}
