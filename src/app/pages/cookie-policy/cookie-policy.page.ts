import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.page.html',
  styleUrls: ['./cookie-policy.page.scss'],
})
export class CookiePolicyPage implements OnInit {

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
  }

  public goBack(): void {

    if(document.referrer.length >0){
      this.location.back();
    }

    else{
      this.router.navigate(['menu/todas']);
    }
   
  }

  async openPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

}
