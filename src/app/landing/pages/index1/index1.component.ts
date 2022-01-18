// https://stackblitz.com/edit/countdown-timer?file=app%2Fhello.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { PopoverController } from '@ionic/angular';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

export interface xTimer {
  szMs: string;
  szDs: string;
  szHs: string;
  szMns: string;
  szSgs: string;
}

@Component({
  selector: 'app-index1',
  templateUrl: './index1.component.html',
  styleUrls: ['./index1.component.scss'],
})

/**
 * Index-1 component
 */
export class Index1Component implements OnInit {
  currentSection = 'home';

  langSelected: ILang;

  constructor(
    private http: HttpClient,
    private router: Router,
    private seoSvc:SeoService,
    public popoverController: PopoverController,
    private translateService: TranslateConfigService,
  ) { }

  ngOnInit() {
    this.seoSvc.generateTags({
          title: 'Febelink Token'
        , description: 'Apúntate a la Whitelist y accede a la venta pública del token Áureo de Febelink'
        , image: 'http://test.febelink.com/assets/imgs/token-share-img.png'
    })
  }

  async ngAfterViewInit() {
    this.langSelected = this.langSelected ? this.langSelected :
      <ILang> await ILangDEFAULTS.getCurrentLang( this.translateService );
  }

  // Destruimos cuando finaliza el contador
  ngOnDestroy() {}

  /**
   * Window scroll method
   */
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (
      document.body.scrollTop >= 50 ||
      document.documentElement.scrollTop > 50
    ) {
      navbar.classList.add('nav-sticky');
    } else {
      navbar.classList.remove('nav-sticky');
    }
  }

  /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('navbarCollapse').classList.toggle('show');
  }

  szDigits2(i_Number: number) {
    return i_Number > 9 ? '' + i_Number : '0' + i_Number;
  }

  async suscribe(emailAddres) {
    const body = {
      email_address: emailAddres,
      status: 'subscribed',
      tags: ['ICO Pública'],
    };

    const headers = {
      'Content-Type': 'application/jsonp',
      Authorization:
        'Basic ZmViZWxpbms6ZTRhYjAwNGFkNGMyMTU4YzgyZTY1YTUwMmE5ZDZlZDEtdXMxOQ==',
      'Access-Control-Allow-Origin': '*',
    };

    await this.http
      .post(
        //'https://us19.api.mailchimp.com/3.0/lists/b3a8767a53/members?skip_merge_validation=true',
        'https://us19.api.mailchimp.com/3.0/lists/b3a8767a53/members?skip_merge_validation=true',
        body,
        { headers }
      )
      .subscribe(() => {
        console.log('Suscribir: ', emailAddres);
      });
  }

  scrollTo(id: string) {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  onLangSelected( iLang: ILang ) {
    this.langSelected = iLang;
  }
}
