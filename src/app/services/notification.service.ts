import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NotifType, UnreadNotificationsCount } from '../models/notification';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private api: ApiService
  ) { }

  unreadNotificationsCount:BehaviorSubject<UnreadNotificationsCount> = new BehaviorSubject(null);
  
  async getNotificacionsLog(){
    const notifListObs:Observable<any> = await this.api._getData('getNotificationsByUserId');
    return notifListObs.pipe(first()).toPromise();
  }

  async getUnreadNotificationsCount(){
    // debugger;
    const notifListObs:Observable<any> = await this.api._getData('getNotificationsCount');
    const res = await notifListObs.pipe(first()).toPromise()
    this.unreadNotificationsCount.next(res);
  }

  async setNotificationsAsRead(type:NotifType){
    // debugger;
    const formData = new FormData();
    formData.append('type', type+'');
    const response:Observable<any> = await this.api._createData('setNotificationsAsRead', formData);
    await response.pipe(first()).toPromise();
    this.getUnreadNotificationsCount();
  }

}
