import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class AccountSvc {
    
  constructor(
    private http: HttpService
  ) {}
  
  async balance()
  {
    return ( await this.http.get( 'wallet/account/balance' )).toPromise();
  }
}
