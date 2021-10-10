import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';

@Component({
  selector: 'app-go-buy-tokens',
  templateUrl: './go-buy-tokens.component.html',
  styleUrls: ['./go-buy-tokens.component.scss'],
})
export class GoBuyTokensComponent {

  @Input() hideTitle: boolean = false;
  @Input() lang: string;

  constructor(
        private router: Router
      , private cookSvc: CookieService ) { }

  ngOnInit() {
    this.lang = this.lang ? this.lang :
        ILangDEFAULTS.getLangDEFAULT( this.cookSvc ).lang;
  }

  goBuyTokens(){
    this.router.navigate([ 'token','buy' ], { queryParams: { lang: this.lang }})
  }

}
