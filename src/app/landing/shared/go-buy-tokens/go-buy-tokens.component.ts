import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-go-buy-tokens',
  templateUrl: './go-buy-tokens.component.html',
  styleUrls: ['./go-buy-tokens.component.scss'],
})
export class GoBuyTokensComponent {

  @Input() hideTitle: boolean = false;

  constructor( private router: Router,  private translateService: TranslateConfigService ) { }

  goBuyTokens(){
    this.router.navigate(['token','buy'])
  }

}
