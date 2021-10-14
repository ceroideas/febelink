import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-legal-disclaimer',
  templateUrl: './legal-disclaimer.page.html',
  styleUrls: ['./legal-disclaimer.page.scss'],
})
export class LegalDisclaimerPage implements OnInit {

  currentYear = new Date().getFullYear();

  constructor(
    private location: Location
    , private router: Router
    , private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setClickPrivacyPolicy( document.getElementById( 'openprivacypolicy1' ));
    this.setClickPrivacyPolicy( document.getElementById( 'openprivacypolicy2' ));
  }

  setClickPrivacyPolicy( el) {
    if( el )
      el.addEventListener('click', ( e ) => this.openPrivacyPolicy() );
    else
      console.log( 'can`t recept clicks to open privacy policy' );
  }

  public goBack(): void {
    this.modalCtrl.dismiss();
    // this.location.back();
  }

  async openPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);

    // Agregué esta linea porque sino cuando abría
    // Las Politicas de Privacidad quedaba por detras
    this.goBack();
  }

}
