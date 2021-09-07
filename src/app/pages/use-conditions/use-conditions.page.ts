import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-use-conditions',
  templateUrl: './use-conditions.page.html',
  styleUrls: ['./use-conditions.page.scss'],
})
export class UseConditionsPage implements OnInit {

  constructor(private location: Location,  private router: Router) {}

  ngOnInit() {
  }

  /**
   * Close modal
   */
   public goBack(): void {
    this.location.back();
  }

  async openPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

  

}
