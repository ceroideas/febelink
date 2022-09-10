import {NumberSymbol} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CartServiceShow} from '../../services/cart.service';
import {CartService} from '../../pages/cart/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  iCart: any;

  constructor(public cartServiceShow: CartServiceShow, private cartService: CartService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.getCart();
  }

  async getCart() {
    const {response, error} = await this.cartService.get();
    this.iCart = response;
  }

  async updateCart(id: number, amount: number) {
    const {response, error} = await this.cartService.update(id, amount);
    this.getCart();
  }

  async buyCart() {
    const {response, error} = await this.cartService.buy();
    console.log(response);
  }

  async emptyCart() {
    for (var item in this.iCart.items) {
      const {response, error} = await this.cartService.update(this.iCart.items[item].productId, 0);
    }
    ;
    this.getCart();
  }

  goToBuscador() {
    this.irA('search');
    this.cartServiceShow.isToggleCart = false;
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

}
