import { Injectable } from '@angular/core';
import { WalletParams } from 'src/app/models/wallet/params.model';
import { WalletInfoSvc } from './wallet-info.service';
import { UserService } from '../user.service';
import { ModalController } from '@ionic/angular';
import { SendComponent } from 'src/app/pages/wallet/send/send.component';
import { IUser } from 'src/app/models/user.model';
import { TranslateConfigService } from '../translate/translate-config.service';
import { ToastSvc } from '../toast.service';
import { UserSessionSvc } from '../user-session.service';

@Injectable({
  providedIn: 'root',
})
export class WalleSendSvc
{
  constructor(
    private walletInfoSvc: WalletInfoSvc,
    private userSvc: UserService,
    private userSessionSvc: UserSessionSvc,
    private modalCtrl: ModalController,
    private translateSvc: TranslateConfigService,
    private toastSvc: ToastSvc,
  ) {}

  async exec( title: string, user: IUser = null, showLoading: boolean = true ): Promise<any>
  {
    if( await this.isUser( user?.id )) return

    const walletParams: WalletParams = await this.walletInfoSvc.get( showLoading )

    // If user has not verified Data and Email, redirect to profile
    if ( !walletParams.verified.mandatory )
    {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const sendTksModal = await this.modalCtrl.create({
      component: SendComponent,
      componentProps: {
        title,
        asset: walletParams.userWallets[0],
        user,
        retainedTks: walletParams.retainedTks,
        assetsMaxDecimals: walletParams.assetsMaxDecimals,

        returnBalance: true,
      },
      cssClass: 'modal-mobile',
    })
    await sendTksModal.present()

    const { data } = await sendTksModal.onDidDismiss()
    return new Promise<any>( resolve => resolve( data?.response ))
  }

  tip( user: IUser, showLoading: boolean = true ): Promise<any>
  {
    if( !user )
    {
      this.toastSvc.show( 'pages.wallet.donate.no-user', true )
      return
    }

    return this.exec( this.translateSvc.instant(
      'pages.wallet.donate.title',
      {
        person: ( user?.name || user?.nick ) +
                ( !user?.lastName ? '' : ' ' + user.lastName )
      }
    ), user, showLoading )
  }

  isUser( id: number ): Promise<boolean>
  {
    return new Promise<boolean>( async resolve =>
    {
      if( !( await this.userSessionSvc.isUser( id ))) {
        resolve( false )
        return
      }

      this.toastSvc.show( 'pages.wallet.donate.same-user', true )
      resolve( false )
    })
  }
}
