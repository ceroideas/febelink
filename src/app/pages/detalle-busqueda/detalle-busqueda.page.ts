import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from 'src/app/tab1/search/services/search.service';
import SwiperCore, {Pagination, Thumbs} from 'swiper';
import {CartService} from '../cart/services/cart.service';

// install Swiper modules
SwiperCore.use([Thumbs]);

@Component({
  selector: 'app-detalle-busqueda',
  templateUrl: './detalle-busqueda.page.html',
  styleUrls: ['./detalle-busqueda.page.scss'],
})
export class DetalleBusquedaPage implements OnInit {

  public detalle: any;
  public data: any;
  thumbsSwiper: any;

  slideOpts = {
    initialSlide: 1,
    effect: 'cards',
    cardsEffect: {
      // ...
    }
  };

  productId;
  productAmount = 1;
  unitTypes = [
    {id: 1, name: 'Día', shorthand: 'día', lang: 'ES'},
    {id: 2, name: 'Mes', shorthand: 'mes', lang: 'ES'},
    {id: 3, name: 'Año', shorthand: 'año', lang: 'ES'},
    {id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES'}
  ]; // ToDo: Get this from the priceType Collection

  constructor(public searchService: SearchService, public router: Router, private route: ActivatedRoute, private cartService: CartService) {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
    });
  }


  ngOnInit() {
    this.getProductDetail(this.productId);
  }

  async getProductDetail(productId) {
    const {response} = await this.searchService.getProductDetail(productId);
    if (response) {
      this.detalle = response;
    }
  }

  async addToCart() {
    const {response} = await this.searchService.addProductToActiveCart(this.productId, this.productAmount);
    if (response) {
      this.irA('/cart');
    }
  }

  async buy() {
    const {response} = await this.cartService.buy();
    window.location.href = response;
  }

  async buyNow() {
    const {response} = await this.searchService.addProductToActiveCart(this.productId, this.productAmount);
    if (response) {
      this.buy();
    }
  }

  onSwiper([swiper]) {
    console.log(swiper);
  }

  onSlideChange() {
    console.log('slide change');
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
