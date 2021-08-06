import { Component, OnInit } from '@angular/core';
import { NotifType } from 'src/app/models/notification';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-notifications-log',
  templateUrl: './notifications-log.page.html',
  styleUrls: ['./notifications-log.page.scss'],
})
export class NotificationsLogPage implements OnInit {

  constructor(
    private api: ApiService
  ) { }

  notifications: Notification;

  async ngOnInit() {
    this.notifications = await this.api.getNotificacionsLog();
  }

  getIconByType(type:NotifType) {
    switch (type) {
      case NotifType.Chat: return 'chatbubbles-outline';
      default: return 'notifications-outline';
    }
  }

}
