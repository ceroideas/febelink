import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { SharePopoverComponent } from './../../../components/share-popover/share-popover.component';
import { IUser } from './../../../models/user.model';
import { GuidePage } from './../../../pages/guide/guide.page';
import { environment } from './../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
// import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { UtilitiesService } from './../../../services/utilities.service';
import { NotificationService } from './../../../services/notification.service';
import { ApiService } from './../../../services/api.service';
import { filter } from 'rxjs/operators';
import { YouTubePopComponent } from './../../../components/youtube/popover/pop.component';
import { CartServiceShow } from '../../../services/cart.service';
import { SeoService } from './../../../services/seo.service';

const GENERAL_DESC = 'Febelink es el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic ';


const GENERAL_TITLE_ORACULO = 'Feed Oráculo | Febelink ¿Qué necesitas?';
const GENERAL_DESC_ORACULO = 'Trucos y consejos de servicios profesionales. El lugar donde compartir experiencias y soluciones';

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.scss'],
})
export class HeaderButtonsComponent implements OnInit {
  //@ts-ignore

  @Input() perfil: IUser;
  //@ts-ignore
  @Input() currentTab: Tabs;
  //@ts-ignore

  @Input() currentUser: IUser;

  tabs = Tabs;
  //@ts-ignore

  notifCount: number;
  //@ts-ignore

  totalUnreadMessages: number;

  homePage: string = environment.HOME_PAGE;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private router: Router,
    private platform: Platform,
    // private socialSharing: SocialSharing,
    public popoverController: PopoverController,
    private translateService: TranslateService,
    private utilities: UtilitiesService,
    private notificationsSvc: NotificationService,
    public cartServiceShow: CartServiceShow,
    private seoSvc: SeoService,
  ) {}

  async ngOnInit() {
    //TODO: These subscribers are called multiple times because header component is in several pages. We should avoid this.
    this.notificationsSvc.unreadNotificationsCount
      .pipe(filter((element) => !!element))
      .subscribe((notifCount) => {
        this.notifCount = notifCount;
        this.notificationsSvc.faviconNotification(
          this.notifCount,
          this.totalUnreadMessages
        );
        this.notificationsSvc.titleNotification(
          this.notifCount,
          this.totalUnreadMessages
        );
      });
    this.api.unreadChatMessages.subscribe((unreadMessages) => {
      this.totalUnreadMessages = 0;
      unreadMessages?.forEach((room) => {
        this.totalUnreadMessages = +room.unread;
      });

      this.notificationsSvc.faviconNotification(
        this.notifCount,
        this.totalUnreadMessages
      );
      this.notificationsSvc.titleNotification(
        this.notifCount,
        this.totalUnreadMessages
      );
    });
  }

  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }

  /**
   * Open YouTube popover
   */
  async openYTguide() {
    const popover = await this.popoverController.create({
      component: YouTubePopComponent,
      translucent: true,
      mode: 'md',
      cssClass: 'pop-yt',
    });
    return await popover.present();
  }

  async irA(p: string): Promise<void> {

    if (p === '/oracles') {
      this.seoSvc.generateTags({title: GENERAL_TITLE_ORACULO, description: GENERAL_DESC_ORACULO});
    } else  {
      this.seoSvc.generateTags({description: GENERAL_DESC});
    }
    
    this.router.navigate([p]);

   
  }

  async shareFebelink(ev: any) {
    const currentUser: IUser = await this.utilities.getUserData();
    const message = await this.translateService.instant('menu.tabs.share-msg');
    let reference: string = '';
    if (currentUser?.id) {
      reference = 'user/' + currentUser.id;
    }
    const url = environment.WEB_URL + reference;
    if (this.platform.is('cordova')) {
      this.shareNative(url, message);
    } else {
      this.shareWeb(ev, url, message);
    }
  }

  /**
   * Share Native ( Android/iOS)
   */
  public shareNative(url: string, message: string, image?: string) {
    // this.socialSharing.share(message, message, image, url);
  }

  /**
   * Share Web
   */
  async shareWeb(ev: any, url: string, message: string, image?: string) {
    const popover = await this.popoverController.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url, title: 'Febelink', desc: message, image },
    });
    return await popover.present();
  }

  /**
   *
   */
}

export enum Tabs {
  Search = 1,
  Recommend = 2,
  Chat = 3,
  Profile = 4,
  ICO = 5,
  Advises = 6,
}
