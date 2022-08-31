import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private isToggleCart:boolean=false;

  constructor() { }

  toggleCart() {
    this.isToggleCart = !this.isToggleCart;
  }
}
