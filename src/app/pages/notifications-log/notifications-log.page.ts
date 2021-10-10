import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification, NotifType } from 'src/app/models/notification';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TermsPage } from '../terms/terms.page';

@Component({
  selector: 'app-notifications-log',
  templateUrl: './notifications-log.page.html',
  styleUrls: ['./notifications-log.page.scss'],
})
export class NotificationsLogPage implements OnInit {
  currentYear = new Date().getFullYear();

  constructor(
    private notificationSvc: NotificationService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  notifications: Notification[];

  async ngOnInit() {
    this.notifications = await this.notificationSvc.getNotificacionsLog();
    this.notifications.map(notif => {
      notif['open'] = false;
    });
  }

  getIconByType(type: NotifType) {
    switch (type) {
      case NotifType.Chat:
        return 'chatbubbles-outline';
      case NotifType.Offer:
        return 'briefcase-outline';
      case NotifType.AllUsers:
        return 'information-outline';
      default:
        return 'notifications-outline';
    }
  }

  async goTo(notification: Notification) {
    if (notification.route) this.router.navigateByUrl(notification.route);
    if (!notification.is_read)
      await this.notificationSvc.setNotificationAsReadById(notification.id);
    notification.is_read = 1;
  }
}
