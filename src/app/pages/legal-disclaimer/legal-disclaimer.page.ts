import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-disclaimer',
  templateUrl: './legal-disclaimer.page.html',
  styleUrls: ['./legal-disclaimer.page.scss'],
})
export class LegalDisclaimerPage implements OnInit {

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
