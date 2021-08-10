import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NotifType, UnreadNotificationsCount } from '../models/notification';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private api: ApiService,
    private utils: UtilitiesService
  ) { }

  unreadNotificationsCount:BehaviorSubject<UnreadNotificationsCount> = new BehaviorSubject(null);
  
  async getNotificacionsLog(){
    const notifListObs:Observable<any> = await this.api._getData('getNotificationsByUserId');
    return notifListObs.pipe(first()).toPromise();
  }

  async getUnreadNotificationsCount(){
    // debugger;
    const notifListObs:Observable<any> = await this.api._getData('getNotificationsCount');
    const notifCount = await notifListObs.pipe(first()).toPromise()
    this.unreadNotificationsCount.next(notifCount);
    this.faviconNotification(notifCount);
    this.titleNotification(notifCount);
  }

  async setNotificationsAsRead(type:NotifType){
    // debugger;
    const formData = new FormData();
    formData.append('type', type+'');
    const response:Observable<any> = await this.api._createData('setNotificationsAsRead', formData);
    await response.pipe(first()).toPromise();
    this.getUnreadNotificationsCount();
  }

  faviconNotification(notifCount:UnreadNotificationsCount){
    const count:number = notifCount.chats + notifCount.offers + notifCount.ratings;
    if(count){
      this.utils.changeFavicon('favicon-notif');
    } else {
      this.utils.changeFavicon('favicon');
    }
  }

  titleNotification(notifCount:UnreadNotificationsCount){
    const count:number = notifCount.chats + notifCount.offers + notifCount.ratings;
    if(count){
      this.utils.changeTitle(`(${count}) Febelink`)
    } else {
      this.utils.changeTitle('Febelink');
    }
  }

}
