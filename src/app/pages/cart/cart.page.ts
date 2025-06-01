import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
// import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
import {
  ModalController,
  PopoverController,
  Platform,
  AlertController,
} from '@ionic/angular';
import {UtilitiesService} from '../../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {UserService} from '../../services/user.service';
import {MailService} from '../../services/mail.service';
import {ReportService} from '../../services/report.service';
import {CartService} from './services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  isEditItems: boolean = false;

  iCart: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    // private socialSharing: SocialSharing,
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
    private authenticationService: AuthenticationService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getCart();
  }

  async getCart() {
    if (this.authenticationService.isAuthenticated()) {

      this.cartSvc.get().then(
        (response: any) => {
          this.iCart = response;
  
        })

    
    } else {
      this.cartSvc.getActiveCart().subscribe((value) => {
        this.iCart = value;
        this.cdRef.detectChanges();
        console.log("test ceroideas",'Carrito offline', this.iCart);
      });
    }
  }

  async updateCart(id: number, amount: number) {

   
    const {response, error} = await this.cartSvc.update(id, amount);
    this.getCart();
  }

  async buyCart() {
    const {response, error} = await this.cartSvc.buy();
    var linkCheckout = response;
    window.location.href = linkCheckout;
  }

  editItems() {
    this.isEditItems = true;
  }

  confirmEdit() {
    this.isEditItems = false;
  }

  goToBuscador() {
    this.irA('search');
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
