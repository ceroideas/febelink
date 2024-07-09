import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { UserService } from './../../services/user.service';
import { MailService } from './../../services/mail.service';
import { ReportService } from './../../services/report.service';

@Component({
  selector: 'app-cart-success',
  templateUrl: './cart-success.page.html',
  styleUrls: ['./cart-success.page.scss'],
})
export class CartSuccessPage implements OnInit {
  bought: number = 0;

  constructor(
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService
  ) {}

  ngOnInit() {}

  goToBuscador() {
    this.irA('search');
  }

  goToHistory() {
    this.irA('cart/history');
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
