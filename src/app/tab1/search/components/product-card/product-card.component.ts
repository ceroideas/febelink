import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

export interface SearchProductCardType {
  id: number;
  imagen: string;
  title: string;
  unitPrice: number;
  unitTypeId: number;
  avgRating: number;
  votes: number;
  ownerUsername: string;
}

export interface PriceUnitType {
  id: number;
  name: string;
  shorthand: string;
  lang: string;
}

@Component({
  selector: 'search-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() data: SearchProductCardType;
  @Input() unitTypes: PriceUnitType[];

  constructor(private router: Router) {
  }

  irA(p: string): void {
    this.router.navigate([p]);
  }
}
