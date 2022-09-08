import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartServiceShow {

  public isToggleCart:boolean=false;

  constructor() { }

  toggleCart() {
    this.isToggleCart = !this.isToggleCart;
  }
}
