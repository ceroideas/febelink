import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IUser } from '../models/user.model';
import { ApiService } from './api.service';
import { MailFnct, MailService } from './mail.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: IUser;

  constructor(
      private router: Router
    , private api: ApiService
    , private mailSvc: MailService
  ){}

  async getUser() {
    if( !this.userInfo )
      this.userInfo = await this.api.utilities.getUserData();
  }

  checkUserDataComplete(user: IUser) {
    // ToDo: control and replace with hasVerifiedMandatory()
    if ( user.dni && user.telefono && user.direccion && user.email_verified_at )
      return true;
    
    this.redir();
    return false;
  }

  async hasVerifiedMandatory(): Promise<boolean> {
    this.api.utilities.showLoading();
    const check = await this.verifiedMandatory();
    this.api.utilities.dismissLoading();

    return new Promise( resolve => resolve( check.verif || this.redir()) );
  }

  async hasVerifiedFull(): Promise<boolean> {
    this.api.utilities.showLoading();
    const check = await this.verifiedMandatory();
    this.api.utilities.dismissLoading();

    return new Promise( resolve => resolve( check.verif || this.redir()) );
  }

  async verifiedFull(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/full' )).toPromise();
  }

  async verifiedMandatory(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/mandatory' )).toPromise();
  }

  async verifiedPhone(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/phone' )).toPromise();
  }

  async verifiedAddress(): Promise<any> {
    return await ( await this.api._getData( 'verif/address' )).toPromise();
  }

  async verifiedEmail(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/email' )).toPromise();
  }

  async verifiedKyc(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/kyc' )).toPromise();
  }

  redir() {
    const navigationExtras: NavigationExtras = {
      state: {msg: 'tabs.tab4.need-to-complete'}
    };
    this.router.navigate(['menu', 'perfil'], navigationExtras);
  }

  async showAlertToRedir() {
    await this.api.utilities.showAlert( null,
      this.api.utilities.translateService.instant( 'tabs.tab4.alert-need-to-complete' ), '', [
      { text: this.api.translateSvc.instant( 'common.no' ), role: 'cancel' },
      {
        text: this.api.translateSvc.instant( 'common.yes' ),
        handler: () => this.redir(),
      },
    ]);
  }

  async blockUser( user: IUser ) {
    await this.getUser();
    
    this.api.utilities.showAlert(
      this.api.translateSvc.instant( 'common.mailTo.block.title' ),
      this.api.translateSvc.instant( 'common.mailTo.block.msg' ), '',
      [
        {
          text: this.api.translateSvc.instant( 'common.buttons.cancel' ),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.api.translateSvc.instant( 'common.buttons.block' ),
          handler: ( data ) => {
            if( (data?.report || '').trim().split( ' ' ).length < 5 ) {
              this.api.utilities.showToast( this.api.translateSvc.instant( 'common.mailTo.error.minLength' ));
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
                + brTab + bO + 'Email: ' + bC + ( user?.email || '--' );

            this.mailSvc.mailTo({
                  email: this.api.translateSvc.instant( 'common.mailTo.support' ),
                  subject: this.api.translateSvc.instant( 'common.mailTo.block.title' ),

                  msg: this.api.translateSvc.instant( 'common.mailTo.from' ) + bC + from
                  + br + br + bO + this.api.translateSvc.instant( 'common.mailTo.to' ) + bC + to
                  + br + br + bO + this.api.translateSvc.instant( 'common.mailTo.msg' ) + bC
                  + br + data.report,

              }, MailFnct.Block
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
}
