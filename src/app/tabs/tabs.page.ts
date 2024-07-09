import { Component } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { UnreadMessages } from '../models/unreadMessages';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  perfil: any;
  public refreshTabs: any;
  notifCount: number = 0;
  totalUnreadMessages: number= 0;
  unreadMessages: UnreadMessages[] | undefined;

  constructor(
    private utilities: UtilitiesService,
    private api: ApiService,
    private router: Router,
    private notificationsSvc: NotificationService
  ) {
    this.refreshTabs = this.api.refreshTab.subscribe((item) =>
      this.obtenerPerfil()
    );
  }

  ionViewWillEnter() {
    this.obtenerPerfil();
    this.api.unreadChatMessages.subscribe((unreadMessages) => {
      this.totalUnreadMessages = 0;
      this.unreadMessages = unreadMessages;
      unreadMessages?.forEach((room) => {
        this.totalUnreadMessages = +room.unread;
      });
    });
  }

  async obtenerPerfil() {
    await this.utilities.getUserData().then((data) => {
      this.perfil = data;
    });
  }

  irA(p:any) {
    if (this.perfil === null) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['/menu/perfil']);
    }
  }
}
