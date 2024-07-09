import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class AccountSvc {
    
  constructor(
    private http: HttpService
  ) {}
  
  async balance(): Promise<IHttpService>
  {
    return this.http.get( 'wallet/account/balance' )
  }
}
