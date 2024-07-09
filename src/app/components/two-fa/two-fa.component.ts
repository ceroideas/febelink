import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.scss'],
})
export class TwoFAComponent implements OnInit {

  isLoading: boolean = false;
  isVerifying: boolean = false;
  loadingMsg: string | undefined;
  code: string | undefined;
  ok: boolean | undefined;
  minutes: number | undefined;
  codeLength: number | undefined;
  error: string | undefined;
  retries: number = -1;

  constructor(
      private popoverController: PopoverController
    , private apiSvc: ApiService
  ) { }

  ngOnInit() {
    this.generate2FAcode();
  }

  onDismiss( ) {
    this.popoverController.dismiss({ verified: false });
  }

  clearCode() {
    this.code = '';
  }

  async generate2FAcode() {
    this.code = '';
    this.error = '';
    this.isLoading = true;
    this.loadingMsg = this.apiSvc.translateSvc.instant( 'common.two-fa.generating' );

    // Count down retry chances
    if( this.retries > 0 ) this.retries--;

    const response = await this.apiSvc.generate2FAcode();
    this.ok = response.ok;
    this.codeLength = response.codeLength;
    this.minutes = response.minutes;
    this.startTimer();

    this.isLoading = false;
  }

  async verify2FAcode() {
    this.error = '';
    if ( this.code?.length === this.codeLength ) {
      this.isVerifying = true;
      this.loadingMsg = this.apiSvc.translateSvc.instant( 'common.two-fa.verifying' );

      const response = await this.apiSvc.verify2FAcode( String(this.code) );
      this.ok = response.ok;

      if( this.ok ) {
        this.popoverController.dismiss({ verified: true });
        return;
      }

      this.error = this.apiSvc.translateSvc.instant( `common.two-fa.error.${ response.status }` );

      this.codeLength = response.codeLength;
      if( response.minutes ) {
        this.minutes = response.minutes;
        this.startTimer();
      }

      this.isVerifying = false;

      // If hasn't retried, set the number of retries availables
      if( this.retries == -1 )
        this.retries = 1;
    }
  }

  counter: { min: number, sec: number } | undefined;
  interval: number = 0
  startTimer() {
    this.counter = { min: Number(this.minutes), sec: 0 };

    if( this.interval )
      clearInterval( this.interval );
   //@ts-ignore
    this.interval = setInterval(() => {
       //@ts-ignore
      if ( this.counter.sec - 1 == -1 ) {
         //@ts-ignore
        this.counter.min -= 1;
         //@ts-ignore
        this.counter.sec = 59
      } 
       //@ts-ignore
      else this.counter.sec -= 1
       //@ts-ignore
      if ( this.counter.min === 0 && this.counter.sec == 0 ) clearInterval( this.interval )
    }, 1000 );
  }

}
