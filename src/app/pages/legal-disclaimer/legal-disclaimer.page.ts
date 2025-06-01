import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-legal-disclaimer',
  templateUrl: './legal-disclaimer.page.html',
  styleUrls: ['./legal-disclaimer.page.scss'],
})
export class LegalDisclaimerPage implements OnInit {
  currentYear = new Date().getFullYear();

  constructor(
    private location: Location,
    private router: Router,
    private modalCtrl: ModalController,
   
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.setClickPrivacyPolicy(document.getElementById('openprivacypolicy1'));
    this.setClickPrivacyPolicy(document.getElementById('openprivacypolicy2'));
    }
  }

  setClickPrivacyPolicy(el: any) {
    if (isPlatformBrowser(this.platformId)) {
    if (el) el.addEventListener('click', (e: any) => this.openPrivacyPolicy());
    else console.log("test ceroideas",'can`t recept clicks to open privacy policy');
    }
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
