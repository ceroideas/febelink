// https://stackblitz.com/edit/countdown-timer?file=app%2Fhello.component.ts
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// OJO OMG es necesario instalar:
// npm install @types/countdown
import * as countdown from 'countdown';
import { BuyTokensComponent } from '../../shared/buy-tokens/buy-tokens.component';
import { NavigationExtras, Router } from '@angular/router';
import { LandingService } from '../../services/landing.service';
import { ModalController, Platform } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ApiService } from 'src/app/services/api.service';

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

  //public emailAddres = '';
  // FECHA DE REFERENCIA
  gdDateTop: countdown.DateTime = new Date(2021, 9, 1);

  giTimerId: number = null;
  gxTimer: xTimer = {
    szMs: '00',
    szDs: '00',
    szHs: '00',
    szMns: '00',
    szSgs: '00',
  };

  constructor(
    private http: HttpClient
    , private router: Router
  ) {}

  navExtras: NavigationExtras

  ngOnInit(): void {
    // https://www.npmjs.com/package/countdown
    this.giTimerId = <number>(
      countdown(this.gdDateTop, (x_Ts: countdown.Timespan) => {
        //console.log(x_Ts);
        this.gxTimer.szMs = this.szDigits2(x_Ts.months);
        this.gxTimer.szDs = this.szDigits2(x_Ts.days);
        this.gxTimer.szHs = this.szDigits2(x_Ts.hours);
        this.gxTimer.szMns = this.szDigits2(x_Ts.minutes);
        this.gxTimer.szSgs = this.szDigits2(x_Ts.seconds);
      })
    );

    this.navExtras = this.router.getCurrentNavigation().extras
  }

  // Destruimos cuando finaliza el contador
  ngOnDestroy() {
    if (this.giTimerId) {
      clearInterval(this.giTimerId as number);
    }
  }

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

  scrollTo(id:string) {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
