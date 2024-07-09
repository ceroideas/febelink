import { IUser } from '../../models/user.model';
import { Component, Input, OnInit } from '@angular/core';
import { WalleSendSvc } from '../../services/wallet/wallet-send.service';

@Component({
  selector: 'app-donate-button',
  templateUrl: './donate-button.component.html',
  styleUrls: ['./donate-button.component.scss'],
})
export class DonateButtonComponent implements OnInit {

  @Input() text: string = 'common.labelDonate'
  @Input() user: any
  @Input() clase: boolean =! ""
  @Input() asButton: boolean = false

  constructor(
    private walletSendSvc: WalleSendSvc,
  ) {}

  ngOnInit() {}

  async donate()
  {
    this.walletSendSvc.tip( this.user )
  }
}
