import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { RegistroPage } from '../registro/registro.page';
import { CookiePolicyPage } from '../cookie-policy/cookie-policy.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  register: RegistroPage;

  constructor(private location: Location,  private router: Router) {
   
   }

  ngOnInit() {
  }

  /**
   * Close modal
   */
   public goBack(): void {
    this.location.back();
  }

  async openCookiePolicy() {
    this.router.navigate(['cookie-policy']);
   
  }

}
