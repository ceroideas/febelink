import {ServicesService} from './../servicios/services/services.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from 'src/app/services/api.service';
import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {
  ModalController,
  PopoverController,
  Platform,
  AlertController,
} from '@ionic/angular';
import {PublicarOpinionPage} from '../publicar-opinion/publicar-opinion.page';
import {GuidePage} from '../guide/guide.page';
import {SharePopoverComponent} from 'src/app/components/share-popover/share-popover.component';
import {environment} from 'src/environments/environment';
import {UtilitiesService} from 'src/app/services/utilities.service';
import {IUser} from 'src/app/models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {UserService} from 'src/app/services/user.service';
import {MailService} from 'src/app/services/mail.service';
import {ReportService} from 'src/app/services/report.service';
import {IReport} from 'src/app/models/report.model';
import {CartService} from '../cart/services/cart.service';
import {IServiceFull} from '../servicios/models/services.model';

@Component({
  selector: 'app-cart-history',
  templateUrl: './cart-history.page.html',
  styleUrls: ['./cart-history.page.scss'],
})
export class CartHistoryPage implements OnInit {
  iCart: any;
  cancelServiceModalToggle = false;
  finishServiceModalToggle = false;
  cartId: number;
  productId: number;
  indexValorarServicio: boolean = false;
  finValorarServicio: boolean = false;
  dragLogged: boolean = false;
  isDisponibles: boolean = true;
  isCurso: boolean = false;
  isFinalizados: boolean = false;
  isNuevoServicio: boolean = false;
  indexTerminarServicio: number;
  indexTerminarServicioMobile: boolean = false;
  servicioAdded: boolean = false;
  unitTypes: any;
  iProducts: any;
  doUpdate: boolean = false;
  editUpdate: number;
  productIdTerminar: number;
  cartIdTerminar: number;
  isTemplate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    private utilities: UtilitiesService,
    private translateService: TranslateService,
    private authSvc: AuthenticationService,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    public cartSvc: CartService,
    private productSvc: ServicesService
  ) {
  }

  ngOnInit() {
    this.getHistoryCart();
  }

  async getHistoryCart() {
    const {response, error} = await this.cartSvc.history();
    this.iCart = response;
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  async cancelProduct() {
    const {response, error} = await this.productSvc.cancel({
      cartId: this.cartId,
      productId: this.productId,
    });

    this.toggleServiceModal();

    if (response) {
      this.getHistoryCart();
    }
  }

  toggleServiceModal(cartId?: number, productId?: number) {
    this.cartId = cartId;
    this.productId = productId;
    this.cancelServiceModalToggle = !this.cancelServiceModalToggle;
  }

  valorarServicio() {
    this.indexValorarServicio = true;
    this.finishServiceModalToggle = false;
    this.dragLogged = false;
  }

  toggleFinishModal(cartId?: number, productId?: number) {
    this.cartId = cartId;
    this.productId = productId;
    this.finishServiceModalToggle = !this.finishServiceModalToggle;
  }

  async aceptarValorarServicio() {
    const productFinish: IServiceFull = {
      cartId: this.cartId,
      productId: this.productId,
    };

    const {response, error} = await this.productSvc.finish(productFinish);

    this.getHistoryCart();

    this.finValorarServicio = true;
    this.indexValorarServicio = false;
    this.indexTerminarServicioMobile = false;
    this.indexTerminarServicio = null;
    this.productIdTerminar = null;
    this.cartIdTerminar = null;
    this.isDisponibles = false;
    this.isCurso = false;
    this.isFinalizados = true;
  }

  cancelarValorarServicio() {
    this.indexValorarServicio = false;
    this.indexTerminarServicioMobile = false;
    this.indexTerminarServicio = null;
    this.productIdTerminar = null;
    this.cartIdTerminar = null;
  }

  closeServicioAdded() {
    this.servicioAdded = false;
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
  }

  cerrarFinValorarServicio() {
    this.finValorarServicio = false;
  }

  cancelarServicio() {
    this.indexTerminarServicio = null;
    this.indexTerminarServicioMobile = false;
    this.dragLogged = false;
    this.productIdTerminar = null;
    this.cartIdTerminar = null;
  }

  terminarServicio(index: number, product: number, cart: number) {
    this.indexTerminarServicio = index;
    this.indexTerminarServicioMobile = true;
    this.productId = product;
    this.cartId = cart;
  }
}
