import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from 'src/app/services/api.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ModalController, PopoverController, Platform, AlertController} from '@ionic/angular';
import {PublicarOpinionPage} from '../publicar-opinion/publicar-opinion.page';
import {GuidePage} from '../guide/guide.page';
import {SharePopoverComponent} from 'src/app/components/share-popover/share-popover.component';
import {environment} from 'src/environments/environment';
import {UtilitiesService} from 'src/app/services/utilities.service';
import {IUser} from 'src/app/models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {UserService} from 'src/app/services/user.service';
import {MailService} from 'src/app/services/mail.service';
import {ReportService} from 'src/app/services/report.service';
import {IReport} from 'src/app/models/report.model';
import {SubscriptionService} from './Services/subscription.service';

export enum SubscriptionType {
  PRO = 'sub-pro',
  PLUS = 'sub-plus',
  PROF = 'sub-prof',
  RANGE_REGION = 'sub-range-region',
  RANGE_COUNTRY = 'sub-range-country',
}

export interface Subscription {
  subscriptionName: SubscriptionType,
  amount: number
}

@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.page.html',
  styleUrls: ['./suscripciones.page.scss'],
})
export class SuscripcionesPage implements OnInit {

  suscriptionChange: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public popoverController: PopoverController,
    public alertController: AlertController,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    private subService: SubscriptionService
  ) {

  }

  ngOnInit() {
    this.getMySubscriptions();
  }

  async getMySubscriptions() {
    const {response} = await this.subService.getMySubscriptions();
    this.subscriptions = response;
  }

  async subscribe(subscriptionName, amount) {
    const {response} = await this.subService.getSubscriptionLink({subscriptionName, amount});
    window.location.href = response;
  }
}
