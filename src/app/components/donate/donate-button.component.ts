import { IUser } from 'src/app/models/user.model';
import { Component, Input, OnInit } from '@angular/core';
import { WalleSendSvc } from 'src/app/services/wallet/wallet-send.service';

@Component({
  selector: 'app-donate-button',
  templateUrl: './donate-button.component.html',
  styleUrls: ['./donate-button.component.scss'],
})
export class DonateButtonComponent implements OnInit {

  @Input() text: string = 'common.labelDonate'
  @Input() user: IUser
  @Input() clase: string
  @Input() asButton: boolean = false

  constructor(
    private walletSendSvc: WalleSendSvc,
  ) {}

  ngOnInit() {}

  async donate()
  {
    console.log({ user: this.user })
    this.walletSendSvc.tip( this.user )
  }
}
