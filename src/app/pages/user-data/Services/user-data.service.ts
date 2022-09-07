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
}
