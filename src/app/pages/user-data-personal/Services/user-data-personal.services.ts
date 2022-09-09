import {Injectable} from '@angular/core';
import {HttpService, IHttpService} from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataPersonalService {

  constructor(
    private http: HttpService
  ) {
  }

  async getUserInfo(): Promise<IHttpService> {
    return this.http.get('user/info');
  }

  async updatePersonalDataUser(userData: any): Promise<IHttpService> {
    return this.http.put('user/update/personal', userData);
  }
}
