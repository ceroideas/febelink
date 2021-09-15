import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { CryptoCurrency } from 'src/app/models/currency.model';
@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  userWallets: CryptoCurrency[] = [];

  constructor(
    private location: Location,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.getCurrencyList();
  }

  public goBack(): void {
    this.location.back();
  }

  async getCurrencyList() {
    const serviceRequest: Observable<any> = await this.walletService
      .getBalanceByUserId('CUSTOM1')
      .then();
    serviceRequest.subscribe((response) => {
      this.userWallets = response.data;
    });
  }
}
