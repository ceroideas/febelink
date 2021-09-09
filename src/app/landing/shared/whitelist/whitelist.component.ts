import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss'],
})
export class WhitelistComponent {

  constructor(
    private api: ApiService,
  ) { }

  response:any

  async addEmailToWhitelist(email: any) {
    // debugger
    const formData = new FormData();
    formData.append('email', email.value);
    const responseObs:Observable<any> = await this.api._createData('emailWhitelist', formData);
    this.response = await responseObs.pipe(first()).toPromise();
    // console.log(this.response);    
  }

}
