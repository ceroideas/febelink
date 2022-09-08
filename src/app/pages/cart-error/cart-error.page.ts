import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, PopoverController, Platform, AlertController } from '@ionic/angular';
import { PublicarOpinionPage } from '../publicar-opinion/publicar-opinion.page';
import { GuidePage } from '../guide/guide.page';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { IUser } from 'src/app/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { MailService } from 'src/app/services/mail.service';
import { ReportService } from 'src/app/services/report.service';
import { IReport } from 'src/app/models/report.model';

@Component({
  selector: 'app-cart-error',
  templateUrl: './cart-error.page.html',
  styleUrls: ['./cart-error.page.scss'],
})
export class CartErrorPage implements OnInit {

  bought:number;

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
    private authSvc:AuthenticationService,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService
    ) { 

    }

  ngOnInit() {
  }

  goToBuscador() {
    this.irA('menu/todas');
  }

  goToCart() {
    this.irA('cart');
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

}
