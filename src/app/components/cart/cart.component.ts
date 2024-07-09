import {NumberSymbol} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CartServiceShow} from '../../services/cart.service';
import {CartService} from '../../pages/cart/services/cart.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  iCart: any;

  constructor(public cartServiceShow: CartServiceShow, private cartService: CartService, private route: ActivatedRoute,
              private router: Router, private authenticationService: AuthenticationService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getCart();
  }

  async getCart() {
    if (this.authenticationService.isAuthenticated()) {
      const {response, error} = await this.cartService.get();
      this.iCart = response;
    } else {
      this.cartService.getActiveCart().subscribe((value) => {
        this.iCart = value;
        this.cdRef.detectChanges();
      });
    }
  }

  async updateCart(id: number, amount: number) {
    const {response, error} = await this.cartService.update(id, amount);
    this.getCart();
  }

  async buyCart() {
    const {response, error} = await this.cartService.buy();
    window.location.href = response;
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
