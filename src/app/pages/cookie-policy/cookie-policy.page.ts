import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

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
    this.location.back();
  }

  async openPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

}
