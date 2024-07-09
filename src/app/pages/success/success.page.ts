import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';
import { UtilitiesService } from '../../services/utilities.service';
import { Subscription } from '../../models/subscription';
type Info = {
  title: string;
  subtitle: string;
  text: string;
};

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

  info: Info = {
    title: "",
    subtitle: "",
    text: "",
  };

  // info: any = {title:string , subtitle:string, text:string}
  ref: string | null = null;

  ngOnInit() {


    this.info = {
      title: `${this.PREFIX}default.title`,
      subtitle: `${this.PREFIX}default.subtitle`,
      text: `${this.PREFIX}default.text`
    };

    if (!this.activatedRoute.snapshot.paramMap.has('ref')) return;

    this.ref = this.activatedRoute.snapshot.paramMap.get('ref');

    this.setTexts(String(this.ref));
    this.acctionsDependingOnRef(String(this.ref));
  }

  async acctionsDependingOnRef(ref:string) {
    switch (ref) {
      case 'subscription-pro':{
        
        const subscriptionInfo:{subscription: any, subscription_details:Subscription} = await this.apiSvc.getUserSusbcription();
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
