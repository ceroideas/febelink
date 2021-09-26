import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss'],
})
export class WhitelistComponent {
  constructor(private api: ApiService, private utils: UtilitiesService) {}

  response: any;

  async addEmailToWhitelist(emailField: any) {
    // debugger
    const email = emailField?.value;
    if (!email) {
      alert('Introduce tu email');
      return;
    }
    await this.utils.showLoading();
    try {
      const formData = new FormData();
      formData.append('email', email);
      const responseObs: Observable<any> = await this.api._createData(
        'emailWhitelist',
        formData
      );
      this.response = await responseObs.pipe(first()).toPromise();
    } catch (error) {
      console.error(error);
    } finally {
      this.utils.dismissLoading();
    }
    // console.log(this.response);
  }
}
