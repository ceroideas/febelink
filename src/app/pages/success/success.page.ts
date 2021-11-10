import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {

  constructor(
    private router: Router
    , private translateService: TranslateConfigService
    , private activatedRoute:ActivatedRoute
  ) { }

  info:{title:string, subtitle:string, text:string, prev?:string}
  ngOnInit() {
    this.setTexts();
  }

  private setTexts() {
    const prefix = 'pages.success.';
    this.info = {
      title: `${prefix}default.title`,
      subtitle: `${prefix}default.subtitle`,
      text: `${prefix}default.text`
    };

    if (!this.activatedRoute.snapshot.paramMap.has('ref')) return;

    const ref = this.activatedRoute.snapshot.paramMap.get('ref');

    if (!['token', 'subscription-pro'].includes(ref)) return;

    this.info = {
      title: `${prefix}${ref}.title`,
      subtitle: `${prefix}${ref}.subtitle`,
      text: `${prefix}${ref}.text`
    };
      
    
  }

  back(){
    let prevArr = [];
    switch (this.info.prev) {
      case 'token':
        prevArr = ['token'];
        break;
      default:
        prevArr = ['menu','todas'];
        break;
    }
    this.router.navigate(prevArr);
  }

}
