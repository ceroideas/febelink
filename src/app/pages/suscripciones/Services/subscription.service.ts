import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from '../../../services/http.service';
import {Subscription} from '../suscripciones.page';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {

  constructor(private http: HttpService) {
  }

  async getMySubscriptions(): Promise<IHttpService> {
    return this.http.get('user/subscriptions');
  }

  async getSubscriptionLink(subscription: Subscription): Promise<IHttpService> {
    return this.http.post('user/subscribe', subscription);
  }
}
