import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-buy-tokens',
  templateUrl: './buy-tokens.component.html',
  styleUrls: ['./buy-tokens.component.scss'],
})
export class BuyTokensComponent {

  constructor(private router: Router) { }

  buyTokens(numTokensInput){
    const numTokens = numTokensInput.value
    console.log(numTokens);
    const navigationExtras: NavigationExtras = {
      state: {numTokens}
    };
    this.router.navigate(['landing', 'checkout'], navigationExtras)
  }

}
