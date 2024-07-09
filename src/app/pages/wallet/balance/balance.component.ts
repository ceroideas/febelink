import { Component, Input, OnInit } from '@angular/core';
import { TokensUser } from '../../../admin/models/tokens-user';
import { CryptoCurrency } from '../../../models/wallet/currency.model';

@Component({
  selector: 'app-wallet-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {

  @Input() asset: CryptoCurrency | undefined;
  @Input() retainedTks: TokensUser[] | undefined;

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

  parseNumber(){
    const assetAmount = this.asset?.amount ?? 0; // Use 0 if this.asset?.amount is undefined
    const sumRetainedTks = this.sumRetainedTks ?? 0; // Use 0 if this.sumRetainedTks is undefined

    return assetAmount - sumRetainedTks;
}
}
