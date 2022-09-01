import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  dataItems:any;
  subtotalItems:any=0;
  isSuccessBuy:boolean=false;
  isNoItems:boolean=false;
  isErrorBuy:boolean=false;

  constructor(public cartService:CartService) { }

  ngOnInit() {
    this.dataItems = [
      {
        servicio: '2x1 masajes drenantes',
        ofertante: 'Fisioterapia Nicolás',
        precio: 50,
        cantidad: 1
      },
      {
        servicio: 'Sesión doble masaje',
        ofertante: 'Fisioterapia Nicolás',
        precio: 44.99,
        cantidad: 1
      },
      {
        servicio: 'Masaje tradicional',
        ofertante: 'Fisioterapia Nicolás',
        precio: 30,
        cantidad: 3
      }
    ];

    for (var key in this.dataItems) {
      this.subtotalItems += this.dataItems[key].precio*this.dataItems[key].cantidad;
    };
  }

  onChangeQuantity(e) {
    this.subtotalItems=0;
    for (var key in this.dataItems) {
      this.subtotalItems += this.dataItems[key].precio*this.dataItems[key].cantidad;
    };
  }
  deleteItem(index:number) {
    this.dataItems.splice(index, 1);

    this.subtotalItems=0;
    for (var key in this.dataItems) {
      this.subtotalItems += this.dataItems[key].precio*this.dataItems[key].cantidad;
    };

    if(this.dataItems.length==0){
      this.isNoItems=true;
      this.isSuccessBuy=false;
      this.isErrorBuy=false;
    }
  }
  buyItems() {
    this.isSuccessBuy=true;
    this.isNoItems=false;
    this.isErrorBuy=false;
  }
  shopItems() {
    this.isNoItems=true;
    this.isSuccessBuy=false;
    this.isErrorBuy=false;
  }
  errorItems() {
    this.isErrorBuy=true;
    this.isNoItems=false;
    this.isSuccessBuy=false;
  }
  restartItems() {
    this.isNoItems=false;
    this.isSuccessBuy=false;
    this.isErrorBuy=false;

    this.dataItems = [
      {
        servicio: '2x1 masajes drenantes',
        ofertante: 'Fisioterapia Nicolás',
        precio: 50,
        cantidad: 1
      },
      {
        servicio: 'Sesión doble masaje',
        ofertante: 'Fisioterapia Nicolás',
        precio: 44.99,
        cantidad: 1
      },
      {
        servicio: 'Masaje tradicional',
        ofertante: 'Fisioterapia Nicolás',
        precio: 30,
        cantidad: 3
      }
    ];

    this.subtotalItems=0;
    for (var key in this.dataItems) {
      this.subtotalItems += this.dataItems[key].precio*this.dataItems[key].cantidad;
    };
  }

}
