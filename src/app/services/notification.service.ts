import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NotifType } from '../models/notification';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';
import { Badge } from '@ionic-native/badge/ngx';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private api: ApiService,
    private utils: UtilitiesService,
    private badge: Badge
  ) {}

  unreadNotificationsCount: BehaviorSubject<number> = new BehaviorSubject(null);

  async getNotificacionsLog() {
    const notifListObs: Observable<any> = await this.api._getData(
      'getNotificationsByUserId'
    );
    // console.log(await notifListObs.pipe(first()).toPromise());
    return notifListObs.pipe(first()).toPromise();
  }

  async getUnreadNotificationsCount() {
    const notifListObs: Observable<any> = await this.api._getData(
      'getNotificationsCount'
    );
    const notifCount = await notifListObs.pipe(first()).toPromise();
    // debugger;
    this.unreadNotificationsCount.next(notifCount);
  }

  async setNotificationsAsRead(type: NotifType) {
    // debugger;
    const formData = new FormData();
    formData.append('type', type + '');
    const response: Observable<any> = await this.api._createData(
      'setNotificationsAsRead',
      formData
    );
    await response.pipe(first()).toPromise();
    this.getUnreadNotificationsCount();
  }

  async setNotificationAsReadById(id: number) {
    const formData = new FormData();

    formData.append('idNotif', id + '');
    const response: Observable<any> = await this.api._createData(
      'setNotificationAsReadById',
      formData
    );
    await response.pipe(first()).toPromise();
    this.getUnreadNotificationsCount();
  }

  faviconNotification(notifCount: number, totalUnreadMessages: number) {
    const count: number = notifCount + totalUnreadMessages;
    this.badge.set(count).catch((err) => {
      if (count) {
        this.utils.updateWebFavicon('favicon-notif');
      } else {
        this.utils.updateWebFavicon('favicon');
      }
    });
  }

  titleNotification(
    notifCount: number,
    totalUnreadMessages: number
  ) {
    const count:number = notifCount + totalUnreadMessages;

    // Lo traigo al titulo que tiene asignado para a este añadirle el contador de notif
    let title: string =  this.utils.getWebTitle();

    if (count) {
      // Para eliminar los contadores de notificaciones que pueda ya tener
      // y luego añadirlo ( para evitar `(1)(1) Title` )
      title = title.replace(/\([0-9]*\)/g, '');

      this.utils.updateWebTitle( `(${count}) ` + title );
    } else {
      this.utils.updateWebTitle(title);
    }
  }
}
