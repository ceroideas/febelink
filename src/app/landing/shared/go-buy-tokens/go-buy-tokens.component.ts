import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-buy-tokens',
  templateUrl: './go-buy-tokens.component.html',
  styleUrls: ['./go-buy-tokens.component.scss'],
})
export class GoBuyTokensComponent {

  @Input() hideTitle: boolean = false;
  @Input() lang: string = "";

  constructor( private router: Router ) { }

  goBuyTokens(){
    this.router.navigate([ 'token','buy' ])
  }

}
