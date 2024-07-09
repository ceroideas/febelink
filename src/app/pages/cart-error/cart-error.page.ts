import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
// import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import {
  ModalController,
  PopoverController,
  Platform,
  AlertController,
} from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user.service';
import { MailService } from '../../services/mail.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-cart-error',
  templateUrl: './cart-error.page.html',
  styleUrls: ['./cart-error.page.scss'],
})
export class CartErrorPage implements OnInit {
  bought: number = 0;

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
    public reportSvc: ReportService
  ) {}

  ngOnInit() {}

  goToBuscador() {
    this.irA('search');
  }

  goToCart() {
    this.irA('cart');
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
