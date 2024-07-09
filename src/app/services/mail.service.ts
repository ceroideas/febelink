import { Injectable } from '@angular/core';
import { IUser } from '../models/user.model';
import { ApiService } from './api.service';
import { TranslateConfigService } from './translate/translate-config.service';
import { UtilitiesService } from './utilities.service';

export enum MailFnct {
  Report = "report",
  Block = "block",
}

@Injectable({
  providedIn: 'root'
})
export class MailService {

  userInfo: IUser | undefined;

  constructor(
      private api: ApiService
    , private utils: UtilitiesService
    , private translateSvc: TranslateConfigService
  ){
    this.getUserInfo();
  }

  async getUserInfo() {
    if( !this.userInfo )
      this.userInfo = await this.utils.getUserData()
  }


  
  reportUser( user: IUser, extra?: string ) {
    this.utils.showAlert(
      this.translateSvc.instant( 'common.mailTo.report.title' ),
      this.translateSvc.instant( 'common.mailTo.report.msg' ), '',
      [
        {
          text: this.translateSvc.instant( 'common.buttons.cancel' ),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translateSvc.instant( 'common.buttons.report' ),
          //@ts-ignore
          handler: ( data: any ) => {
            if(( data?.report || '' ).trim().split( ' ' ).length < 5 ) {
              this.utils.showToast( this.translateSvc.instant( 'common.mailTo.error.minLength' ));
              return false;
            }

            const bO: string = "<b>",
                bC: string = "</b>",
                br: string = "\n",
                brTab: string = br + "\t";

            const from: string = brTab + bO + "Id: " + bC + this.userInfo?.id
            + brTab + bO + "Nombre: " + bC + ( this.userInfo?.name || this.userInfo?.nick)
                    + " " + ( this.userInfo?.lastName || '' )
            + brTab + bO + 'Email: ' + bC + this.userInfo?.email;
            
            const to: string = brTab + bO + "Id: " + bC + user?.id
                + brTab + bO + "Nombre: " + bC + ( user?.name || user?.nick) + " " + ( user?.lastName || '' )
                + brTab + bO + 'Email: ' + bC + ( user?.email || '' );

            this.mailTo({
                    email: this.translateSvc.instant( 'common.mailTo.support' ),
                    subject: this.translateSvc.instant( 'common.mailTo.report.title' ),

                    msg: bO + this.translateSvc.instant( 'common.mailTo.from' ) + bC + from
                    + br + br + bO + this.translateSvc.instant( 'common.mailTo.to' ) + bC + to
                    + br + br + bO + this.translateSvc.instant( 'common.mailTo.msg' ) + bC
                    + br + data.report
                    
                    + ( !extra ? '' : br + br + extra ),
                }, MailFnct.Report
            );
          }
        }
      ],
      [
        {
          name: 'report',
          id: 'report',
          type: 'textarea',
          placeholder: ''
        }
      ]
    );
  }

    async mailTo( params: {
            email: string,
            subject: string,
            title?: string,
            msg: string,
        }, fnct?: MailFnct
    ) {
        await this.utils.showLoading();
        const formData = new FormData();
        formData.append( 'email', params.email );
        formData.append( 'subject', params.subject );
        formData.append( 'title', params?.title || params?.subject );
        formData.append( 'message', params.msg );
        const res = await ( await this.api._createData( 'mail/' + fnct, formData )).toPromise();
        await this.utils.dismissLoading();
        this.utils.showToast( res.message );
  }
}
