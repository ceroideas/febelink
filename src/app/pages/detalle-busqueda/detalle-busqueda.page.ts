import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from './../../tab1/search/services/search.service';
import SwiperCore, {Pagination, Thumbs} from 'swiper';
import {CartService} from '../cart/services/cart.service';
import {ChatService} from '../../services/chat.service';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import { AdviseService } from '../posts/advises/services/advises.service';
import { UserDataService } from '../user-data/Services/user-data.service';
import { isPlatformBrowser } from '@angular/common';
import { UtilitiesService } from '../../services/utilities.service';
import { UserSessionSvc } from '../../services/user-session.service';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../../services/seo.service';

import { toSlug } from '../../../utils/utils';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

// install Swiper modules
SwiperCore.use([Thumbs]);

@Component({
  selector: 'app-detalle-busqueda',
  templateUrl: './detalle-busqueda.page.html',
  styleUrls: ['./detalle-busqueda.page.scss'],
})
export class DetalleBusquedaPage implements OnInit {

  toSlug = toSlug;

  public detalle: any;
  public data: any;
  thumbsSwiper: any;
  thumbsSwiper1: any;
  displayPartialSignUp: boolean = false;
  urlWsrv: string = environment.baseWebUrlWsrv;

  email: string ="";

  slideOpts = {
    initialSlide: 1,
    effect: 'cards',
    cardsEffect: {
      // ...
    }
  };
  user: any ={}
  productId: any;
  productAmount = 1;
  iAdvises: any = [];
  othersView: any[] = [];
  moreWorks: any = [];
  metas: any = {
    title: '',
    description: ''
  }
  otherTitelOracle: boolean = false;
  titleProduct: string = ""
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

  viewTimeout: NodeJS.Timeout | undefined;
  
  constructor( public searchService: SearchService, public router: Router, private route: ActivatedRoute,
              private cartService: CartService, private chatService: ChatService, public authService: AuthenticationService, 
              private profileUser: UserDataService,
              private adviseSvc: AdviseService,
              private utilities: UtilitiesService,
              public sessionSvc: UserSessionSvc,
              private title : Title,
              private seoService: SeoService,
              private apiService: ApiService,
              @Inject(PLATFORM_ID) private platformId: Object) {

               
                
    this.route.paramMap.subscribe((params) => {
      params.get('title');
      //@ts-ignore
      let title =  params.get('title').replace(/-/g, ' ');;

      this.titleProduct = title
      //@ts-ignore
      this.title.setTitle(title)


      this.productId = params.get('id');
    });
  }

  ngOnInit() {
    this.getProductDetail(this.productId);

    if ( this.productId ) {
      if ( isPlatformBrowser(this.platformId) ) {
        this.viewTimeout = setTimeout(() => {
          // Register offer view
          this.apiService.offerViewed(this.productId);
        }, 1000);
      }
    }
  }

  ngOnDestroy() {
    this.viewTimeout && clearTimeout(this.viewTimeout);
  }

 
  getProductDetail(productId: any) {

    if (isPlatformBrowser(this.platformId)) {
      const othersViewData =  sessionStorage.getItem('searchResponse');
      sessionStorage?.setItem('productId', productId)
  
    }
    //@ts-ignore
    this.searchService.getProductDetail(productId).then((data: any) => {
        this.detalle = data.response;
        

        this.seoService.generateTags({title:this.titleProduct ,image: this.detalle.images[0], description:  this.detalle.description});

        // this.getFeed();
        this.getOthersWork()
        this.getProductUser()
        this.getDetailUser()
    })
  }


  // async getFeed() {
  //   var filters = {
  //     activePage: 1,
  //     keys: null,
  //     topic: null,
  //     sector: null,
  //     subsector: null,
  //     lang: null,
  //     user: this.detalle.ownerId,
  //     hideContent: true,
  //     content: null,
  //   };
  //   const {response, error} = await this.adviseSvc.list(filters);
  //   this.iAdvises = response;

  //   if ( this.iAdvises.length === 0) {
  //     this.otherTitelOracle = true;
  //     var filters = {
  //       activePage: 1,
  //       keys: null,
  //       topic: null,
  //       sector: null,
  //       subsector: null,
  //       lang: null,
  //       user: null,
  //       hideContent: true,
  //       content: null,
  //     };
  //     const {response, error} = await this.adviseSvc.list(filters);
  //     this.iAdvises = response;
  //   }
  // }

  async getProductUser() {
    var user =  this.detalle.ownerId

    this.profileUser.getUserProduct(user).then((data: any) => {
      if (!!data.response)
        this.moreWorks = data.response.available
        .filter((item: any) => item.productId !== Number(this.productId))
        .slice(0, 4);
    })
    
  }

  async getDetailUser() {

    this.profileUser.getUserDetail( this.detalle.ownerId).then((data: any) => {
      if (data.response) {
      
        this.user = {
          description: data.response.description,
          phoneNumber: data.response.phoneNumber,
        };
      }
    })

  

  }
  getOthersWork(){
      //@ts-ignore


      
    if (isPlatformBrowser(this.platformId)) {
      //@ts-ignore
      const othersViewData = JSON.parse( sessionStorage.getItem('searchResponse'));
        if ( !!othersViewData ) {
        let dataOthersService = othersViewData.services;
        this.othersView = dataOthersService.filter((_data: any) => _data.ownerUserId !== this.detalle.ownerId)
      } else {
     
      }
  
    }
    
  }

  async addToCart() {


    this.cartService.addProductToActiveCart( this.productId, this.productAmount ).then(async (response: any) => {
      if (response) {
        await this.cartService.setActiveCart({items: [response]});
        this.irA('/cart');
      }
    })
   
  }

  async buy() {

    this.cartService.buy().then((response: any) => {
      window.location.href = response;
    })

   
  }

  async buyNow(productId: number, productAmount: number) {

    let userId = await this.sessionSvc.get();
    if(userId == null){
      this.router.navigate([`login`]);
      
    } else {
      this.cartService.buyNow(productId, productAmount, this.email).then(
        (response: any) => {
          window.location.href = response
  
        })
    }

  }

  onSwiper([swiper]: any) {
  }

  onSlideChange() {
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  async createChat(ownerUsername: string, ownerUserId: number) {
    this.chatService.createChat(  this.detalle.ownerId ).then((response: any) => {
      if (response) {
        // Send first comment
        this.router.navigate([`chat/${response?.id}`], {
          state: {receiverId: ownerUserId, receiverUsername: ownerUsername},
        });
      } else {
        this.router.navigate([`chat`]);
      }
    })
  }
  
  async registerClick(publication: any){

    let userId = await this.sessionSvc.get();
    let data = {
      publication: publication,
      user: userId?.id
    }
    const {response, error} = await this.searchService.registerClick(data);
  }
}
