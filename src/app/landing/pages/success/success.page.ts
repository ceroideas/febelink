import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage {

  constructor(
    private router: Router,
    private cookSvc: CookieService,
    private translateService: TranslateConfigService
  ) { }

  ngOnInit() { }

  back(){
    this.router.navigate(['token'])
  }
}
