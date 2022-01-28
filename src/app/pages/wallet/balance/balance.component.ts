import { Component, Input, OnInit } from '@angular/core';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { CryptoCurrency } from 'src/app/models/currency.model';

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {

  @Input() asset: CryptoCurrency;
  @Input() retainedTks: TokensUser[];

  @Input() isRetainedShowing: boolean = false;
  @Input() isDetailsShowing: boolean = false;
  
  @Input() assetsMaxDecimals: number = 7;
  sumRetainedTks: number = 0;
  
  constructor() { }

  ngOnInit() {
    this.sumRetained();
  }

  sumRetained() {
    this.sumRetainedTks = 0;
    this.retainedTks?.forEach( tk => this.sumRetainedTks += Number( tk?.num_tokens || '0' ));
  }

}
