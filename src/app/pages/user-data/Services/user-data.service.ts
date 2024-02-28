import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  constructor(
    private http: HttpService
  ) {
  }

  async getUserInfo(): Promise<IHttpService> {
    return this.http.get('user/info');
  }

  async getUserDetail(userId: string): Promise<IHttpService> {
    return this.http.get('user/detail/' + userId);
  }


  async getUserProduct(userId: string): Promise<IHttpService> {
    return this.http.get('product/user/' + userId);
  }

  async updateBasicInfoUserData(userData: any): Promise<IHttpService> {
    return this.http.post('user/update', userData);
  }
}
