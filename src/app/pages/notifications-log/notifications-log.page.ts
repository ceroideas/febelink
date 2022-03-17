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
  ) {}

  notifications: Notification[];
  isLoading: boolean = false

  async ngOnInit() {
    await this.get()
  }

  async get( event: any = null )
  {
    if( event ) event.target.complete()
    
    this.isLoading = true
    this.notifications = await this.notificationSvc.getNotificacionsLog();
    this.notifications.map(notif => {
      notif['open'] = false;
    });
    this.isLoading = false
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
  }

  async open(notif){
    notif.open = !notif.open
    if (!notif.is_read) await this.notificationSvc.setNotificationAsReadById(notif.id);
    notif.is_read = 1;
  }
}
