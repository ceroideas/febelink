import {ServicesService} from './../servicios/services/services.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from './../../services/api.service';
// import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {
  ModalController,
  PopoverController,
  Platform,
  AlertController,
} from '@ionic/angular';
import {UtilitiesService} from './../../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from './../../services/authentication/authentication.service';
import {UserService} from './../../services/user.service';
import {MailService} from './../../services/mail.service';
import {ReportService} from './../../services/report.service';
import {CartService} from '../cart/services/cart.service';
import {IServiceFull} from '../servicios/models/services.model';
import { RatingModalComponent } from '../../components/rating-modal/rating-modal.component';

@Component({
  selector: 'app-cart-history',
  templateUrl: './cart-history.page.html',
  styleUrls: ['./cart-history.page.scss'],
})
export class CartHistoryPage implements OnInit {
  iCart: any;
  cancelServiceModalToggle = false;
  finishServiceModalToggle = false;
  cartId: number = 0;
  productId: number = 0;
  indexValorarServicio: boolean = false;
  finValorarServicio: boolean = false;
  dragLogged: boolean = false;
  isDisponibles: boolean = true;
  isCurso: boolean = false;
  isFinalizados: boolean = false;
  isNuevoServicio: boolean = false;
  indexTerminarServicio: number = 0;
  indexCancelServicio: number = 0;
  indexTerminarServicioMobile: boolean = false;
  servicioAdded: boolean = false;
  unitTypes: any;
  iProducts: any;
  doUpdate: boolean = false;
  editUpdate: number = 0;
  productIdTerminar: number = 0;
  cartIdTerminar: number = 0;
  isTemplate: boolean = false;
  showCancel: boolean = false;
  showFinish: boolean = false;

  isCart: boolean = true;
  isPeticions: boolean = false;

  peticions: any = []
  modalCtrl: any;
  apiService: any;
  constructor(
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    public cartSvc: CartService,
    private productSvc: ServicesService
  ) {
  }

  ngOnInit() {
    this.getHistoryCart();
    this.getfindServices();
  }

  async getfindServices() {
    this.cartSvc.getFindServices().then(async (data: any) => {
     this.peticions = data.response
    })

  }
  async getHistoryCart() {
    this.cartSvc.history().then(async (data: any) => {
      this.iCart = data.response;
    })
    
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  async cancelProduct() {
    this.toggleServiceModal();

    this.productSvc.cancel({
      cartId: this.cartId,
      productId: this.productId,
      }).then(async (data: any) => {
        if (data.response) {
          this.getHistoryCart();
        }
      })
  }

  selectCart(){
    this.isCart = true;
    this.isPeticions = false;
  }

  selectPeticions(){
    this.isCart = false;
    this.isPeticions = true;
  }
  toggleServiceModal(cartId?: number, productId?: number, index_cart?: number) {
    this.showCancel = true;
    //@ts-ignore
    this.indexCancelServicio = index_cart
    if (cartId !== undefined) {
        this.cartId = cartId;
    }
    //@ts-ignore

    this.productId = productId;
    this.cancelServiceModalToggle = !this.cancelServiceModalToggle;
  }

  valorarServicio(userId: number) {
    // this.indexValorarServicio = true;
    // this.finishServiceModalToggle = false;
    // this.dragLogged = false;

    this.openRatingModal(userId);
  }

  toggleFinishModal(cartId?: number, productId?: number) {
    //@ts-ignore

    this.cartId = cartId;
    //@ts-ignore

    this.productId = productId;
    this.finishServiceModalToggle = !this.finishServiceModalToggle;
  }

  async aceptarValorarServicio() {
    const productFinish: IServiceFull = {
      cartId: this.cartId,
      productId: this.productId,
    };


    this.productSvc.cancel(productFinish).then(async (response: any) => { })

    

    this.getHistoryCart();

    this.finValorarServicio = true;
    this.indexValorarServicio = false;
    this.indexTerminarServicioMobile = false;
    this.showFinish = false;
    this.showCancel = false;
    //@ts-ignore

    this.indexTerminarServicio = null;
    //@ts-ignore

    this.productIdTerminar = null;
    //@ts-ignore

    this.cartIdTerminar = null;
    this.isDisponibles = false;
    this.isCurso = false;
    this.isFinalizados = true;
  }

  cancelarValorarServicio() {
    this.indexValorarServicio = false;
    this.indexTerminarServicioMobile = false;
    //@ts-ignore

    this.indexTerminarServicio = null;
    //@ts-ignore

    this.productIdTerminar = null;
    this.showFinish = false;
    this.showCancel = false;
    //@ts-ignore

    this.cartIdTerminar = null;
  }

  closeServicioAdded() {
    this.servicioAdded = false;
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
    this.showFinish = false;
    this.showCancel = false;
  }

  cerrarFinValorarServicio() {
    this.finValorarServicio = false;
  }

  cancelarServicio() {
    //@ts-ignore

    this.indexTerminarServicio = null;
    this.indexTerminarServicioMobile = false;
    this.dragLogged = false;
    //@ts-ignore

    this.productIdTerminar = null;
    //@ts-ignore

    this.cartIdTerminar = null;
    this.showFinish = false;
    this.showCancel = false;
  }

  terminarServicio(index: number, product: number, cart: number) {
    this.indexTerminarServicio = index;
    this.indexTerminarServicioMobile = true;
    this.productId = product;
    this.cartId = cart;
    this.showFinish = true;
  }

  showDetailFindService(item: any ){
    this.router.navigate(['pedir-presupuesto-gratis/'+item.id])
  }
  
  async openRatingModal(userId: number, rateOnly: boolean = false) {
    const modal = await this.modalCtrl.create({
      cssClass: "fit-modal floating-modal",
      component: RatingModalComponent,
      componentProps: { mode: 'client' },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      if ( !rateOnly ) {
        this.aceptarValorarServicio();
      }

      if (data?.rating) {
        this.apiService.rateUser(userId, data.rating, data.comment || '');
      }
    }
  }
}
