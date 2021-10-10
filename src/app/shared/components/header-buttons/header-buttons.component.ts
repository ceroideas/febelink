import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';
import { IUser } from 'src/app/models/user.model';
import { GuidePage } from 'src/app/pages/guide/guide.page';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UnreadNotificationsCount } from 'src/app/models/notification';
import { ApiService } from 'src/app/services/api.service';
import { YouTubePopComponent } from 'src/app/components/youtube/popover/pop.component';

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.scss'],
})
export class HeaderButtonsComponent implements OnInit {
  @Input() perfil: IUser;
  @Input() currentTab: Tabs;
  tabs = Tabs;
  notifCount: UnreadNotificationsCount;
  totalUnreadMessages: number;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private router: Router,
    private platform: Platform,
    private socialSharing: SocialSharing,
    public popoverController: PopoverController,
    private translateService: TranslateService,
    private utilities: UtilitiesService,
    private notificationsSvc: NotificationService
  ) {}

  async ngOnInit() {
    // ToDo: These subscribers are called multiple times because header component is in several pages. We should avoid this.
    this.notificationsSvc.unreadNotificationsCount.subscribe((notifCount) => {
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
    this.router.navigate([p]);

    // if (p === '/menu/perfil') {
    //   if (!this.perfil) {
    //     this.router.navigate(['login']);
    //   } else {
    //     this.router.navigate(['/menu/perfil']);
    //   }
    // } else {
    // }
  }

  async shareFebelink(ev: any) {
    const currentUser: IUser = await this.utilities.getUserData();
    const message = await this.translateService.instant('menu.tabs.share-msg');
    let reference: string = '';
    if (currentUser?.id) reference = 'user/' + currentUser.id;
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
    this.socialSharing.share(message, message, image, url);
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
}
