import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotifType } from 'src/app/models/notification';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TermsPage } from '../terms/terms.page';

@Component({
  selector: 'app-notifications-log',
  templateUrl: './notifications-log.page.html',
  styleUrls: ['./notifications-log.page.scss'],
})
export class NotificationsLogPage implements OnInit {

  constructor(
    private notificationSvc:NotificationService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  notifications: Notification;
  currentYear = new Date().getFullYear();

  async ngOnInit() {
    this.notifications = await this.notificationSvc.getNotificacionsLog();
  }

  getIconByType(type:NotifType) {
    switch (type) {
      case NotifType.Chat: return 'chatbubbles-outline';
      default: return 'notifications-outline';
    }
  }

  goTo(route:string){
    if(route) this.router.navigateByUrl(route)
  }

  async termsModal() {
    const TermsModal = await this.modalCtrl.create({
      component: TermsPage,
    });

    await TermsModal.present();
  }

}
