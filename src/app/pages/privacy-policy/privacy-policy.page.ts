import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';
import { Registro2Component } from '../registro2/registro2.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  register: Registro2Component | undefined;

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
