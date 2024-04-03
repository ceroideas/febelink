import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { MailService } from 'src/app/services/mail.service';
import { ReportService } from 'src/app/services/report.service';
import { SubscriptionService } from './Services/subscription.service';

export enum SubscriptionType {
  PRO = 'sub-pro',
  PLUS = 'sub-plus',
  PROF = 'sub-prof',
  RANGE_REGION = 'sub-range-region',
  RANGE_COUNTRY = 'sub-range-country',
}

export interface Subscription {
  subscriptionName: SubscriptionType;
  amount: number;
}

@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.page.html',
  styleUrls: ['./suscripciones.page.scss'],
})
export class SuscripcionesPage implements OnInit {
  suscriptionChange: boolean = false;

  proUser: boolean = false;
  subLoaded: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public popoverController: PopoverController,
    public alertController: AlertController,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    private subService: SubscriptionService
  ) {}

  ngOnInit() {
    this.getMySubscriptions();
  }

  async getMySubscriptions() {
    const { response } = await this.subService.getMySubscriptions();
    this.subscriptions = response;
    this.subLoaded = true;
    if (this.subscriptions.find((e) => e.subscriptionName === 'sub-pro')) {
      this.proUser = true;
    }
  }

  async subscribe(subscriptionName, amount) {
    const { response } = await this.subService.getSubscriptionLink({
      subscriptionName,
      amount,
    });

    if (typeof response === 'string') {
      window.location.href = response;
    } else {
      await this.getMySubscriptions();
      this.suscriptionChange = false;
    }
  }

  findSubscription(searchTerm: string) {
    return this.subscriptions.find((e) =>
      e.subscriptionName.includes(searchTerm)
    );
  }
}
