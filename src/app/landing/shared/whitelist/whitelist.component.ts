import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { TranslateConfigService } from '../../../services/translate/translate-config.service';
import { ILang, ILangDEFAULTS } from '../../../models/langs.model';
import { IUser } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss'],
})
export class WhitelistComponent implements OnInit {

  constructor(
      private api: ApiService
    , private utils: UtilitiesService
    , private translateService: TranslateConfigService
    , private router: Router
  ) {}
  
  async ngOnInit() {
    this.lang = this.lang ? this.lang :
      (<ILang> await ILangDEFAULTS.getCurrentLang( this.translateService )).lang;
  }

  @Input() lang: string = "";
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
  }

  async login() {
    const user: IUser = await this.utils.getUserData();
    this.router.navigate([ user ? environment.HOME_PAGE : 'login']);
  }
}
