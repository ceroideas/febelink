import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from 'src/app/tab1/search/services/search.service';
import SwiperCore, {Pagination, Thumbs} from 'swiper';
import {CartService} from '../cart/services/cart.service';
import {ChatService} from '../../services/chat.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';

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
  thumbsSwiper1: any;
  displayPartialSignUp: boolean = false;
  email: string;

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
    {id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES'},
    {id: 5, name: 'Hora', shorthand: 'hora', lang: 'ES'},
    {id: 6, name: 'Consulta', shorthand: 'consulta', lang: 'ES'},
    {id: 7, name: 'Sesión', shorthand: 'sesión', lang: 'ES'},
    {id: 8, name: 'Jornada', shorthand: 'jornada', lang: 'ES'},
    {id: 9, name: 'Oferta', shorthand: 'oferta', lang: 'ES'},
    {id: 10, name: 'Campaña', shorthand: 'campaña', lang: 'ES'},
    {id: 11, name: 'Porcentaje', shorthand: '%', lang: 'ES'},
    {id: 12, name: 'Donación', shorthand: 'donación', lang: 'ES'},
    {id: 13, name: 'Presupuesto', shorthand: 'presupuesto', lang: 'ES'},
  ]; // ToDo: Get this from the priceType Collection

  constructor(public searchService: SearchService, public router: Router, private route: ActivatedRoute,
              private cartService: CartService, private chatService: ChatService, public authService: AuthenticationService) {
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
    const {response} = await this.cartService.addProductToActiveCart(this.productId, this.productAmount);
    if (response) {
      await this.cartService.setActiveCart({items: [response]});
      this.irA('/cart');
    }
  }

  async buy() {
    const {response} = await this.cartService.buy();
    window.location.href = response;
  }

  async buyNow(productId: number, productAmount: number) {
    const {response} = await this.cartService.buyNow(productId, productAmount, this.email);
    window.location.href = response;
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

  async createChat(ownerUsername: string, ownerUserId: number) {
    const {response, error} = await this.chatService.createChat(
      ownerUserId
    );

    if (response) {
      // Send first comment

      this.router.navigate([`chat/${response?.id}`], {
        state: {receiverId: ownerUserId, receiverUsername: ownerUsername},
      });
    }

    if (error) {
      this.router.navigate([`chat`]);
    }
  }
}
