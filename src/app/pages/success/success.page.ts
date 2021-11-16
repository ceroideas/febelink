import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'src/app/models/subscription';
import { ApiService } from 'src/app/services/api.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

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
    , private utilities: UtilitiesService
    , private apiSvc:ApiService
    ) { }
    
  PREFIX = 'pages.success.';
  info:{title:string, subtitle:string, text:string}
  ref: string

  ngOnInit() {
    this.info = {
      title: `${this.PREFIX}default.title`,
      subtitle: `${this.PREFIX}default.subtitle`,
      text: `${this.PREFIX}default.text`
    };

    if (!this.activatedRoute.snapshot.paramMap.has('ref')) return;

    this.ref = this.activatedRoute.snapshot.paramMap.get('ref');

    this.setTexts(this.ref);
    this.acctionsDependingOnRef(this.ref);
  }

  async acctionsDependingOnRef(ref:string) {
    switch (ref) {
      case 'subscription-pro':{
        
        const subscriptionInfo:{subscription, subscription_details:Subscription} = await this.apiSvc.getUserSusbcription();
        await this.utilities.saveUserSubscription(subscriptionInfo.subscription);
        await this.utilities.saveUserSubscriptionDetails(subscriptionInfo.subscription_details);
        break;
      }
    }
  }

  private setTexts(ref:string) {
    if (!['token', 'subscription-pro'].includes(ref)) return;

    this.info = {
      title: `${this.PREFIX}${ref}.title`,
      subtitle: `${this.PREFIX}${ref}.subtitle`,
      text: `${this.PREFIX}${ref}.text`
    };
      
    
  }

  back(){
    let prevArr = [];
    switch (this.ref) {
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
