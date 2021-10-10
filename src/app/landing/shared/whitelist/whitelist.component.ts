import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { ApiService } from 'src/app/services/api.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss'],
})
export class WhitelistComponent {
  constructor(
    private api: ApiService,
    private utils: UtilitiesService,
    private translateService: TranslateConfigService ) {}

  @Input() lang: string = ILangDEFAULTS.getLangDEFAULT().lang;
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
      formData.append('lang', this.lang);
      
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
    console.log(this.response);
  }
}
