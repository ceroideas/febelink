import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { KeywordService } from './../../admin/keyword/services/keyword.service';
import { LegalDisclaimerPage } from './../../pages/legal-disclaimer/legal-disclaimer.page';
import { TermsPage } from './../../pages/terms/terms.page';
import { IHttpService } from '../../services/http.service';
import { Keywords } from '../../interfaces/keywords';
import { Link } from '../../interfaces/link';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit{
  currentYear = new Date().getFullYear();
  footerLinks: Link[] = []

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private keywordService: KeywordService,
    private modalCtrl: ModalController,
  ) {}


  async ngOnInit() {
    this.keywordService.getData().then((data: IHttpService) => {
      this.footerLinks = (data.response as Keywords).links;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.keywordService.getData(false).then((data: IHttpService) => {
        this.footerLinks = (data.response as Keywords).links;
      });
    }
  }


  async termsModal() {
    const TermsModal = await this.modalCtrl.create({
      component: TermsPage,
    });

    await TermsModal.present();
  }

  
  async openLegalDisclaimer() {
    const TermsModal = await this.modalCtrl.create({
      component: LegalDisclaimerPage,
    });

    await TermsModal.present();
  }
}
