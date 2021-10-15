import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

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
      , private translateService: TranslateConfigService ) { }

  ngOnInit() {
    this.lang = this.lang ? this.lang :
        ILangDEFAULTS.getCurrentLang( this.translateService ).lang;
  }

  goBuyTokens(){
    this.router.navigate([ 'token','buy' ], { queryParams: { lang: this.lang }})
  }

}
