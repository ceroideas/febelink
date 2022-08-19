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
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  dataItems:any;
  isEditItems:boolean=false;
  isSuccessBuy:boolean=false;
  isNoItems:boolean=false;

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
    ]
  }

  changeQuantity(index:number) {
    this.dataItems[index].cantidad--;
  }
  deleteItem(index:number) {
    this.dataItems.splice(index, 1);

    if(this.dataItems.length==0){
      this.isNoItems=true;
      this.isSuccessBuy=false;
      this.isEditItems=false;
    }
  }

  editItems() {
    this.isEditItems=true;
  }
  confirmEdit() {
    this.isEditItems=false;
  }
  buyItems() {
    this.isSuccessBuy=true;
    this.isEditItems=false;
    this.isNoItems=false;
  }
  shopItems() {
    this.isNoItems=true;
    this.isSuccessBuy=false;
    this.isEditItems=false;
  }
  restartItems() {
    this.isNoItems=false;
    this.isSuccessBuy=false;
    this.isEditItems=false;

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
    ]
  }


  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
