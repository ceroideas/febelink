import { Component } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { UnreadNotificationsCount } from '../models/notification';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  perfil: any;
  public refreshTabs: any;
  notifCount:UnreadNotificationsCount;
  
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
    this.notificationsSvc.unreadNotificationsCount.subscribe(notifCount => {
      console.log(notifCount);       
      this.notifCount = notifCount;
    })   
  }

  async obtenerPerfil() {
    await this.utilities.getUserData().then((data) => {
      this.perfil = data;
    });
  }

  irA(p) {
    if (this.perfil === null) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['/menu/perfil']);
    }
  }
}
