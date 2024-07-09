import { Injectable } from '@angular/core';
import { WalletInfoSvc } from './wallet-info.service';
import { UserService } from '../user.service';
import { ModalController } from '@ionic/angular';
import { TranslateConfigService } from '../translate/translate-config.service';
import { ToastSvc } from '../toast.service';
import { UserSessionSvc } from '../user-session.service';
import { IUser } from '../../models/user.model';
import { WalletParams } from '../../models/wallet/params.model';
import { SendComponent } from '../../pages/wallet/send/send.component';

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

  async exec( title: string, user: IUser , showLoading: boolean = true ): Promise<any>
  {
    if( await this.isUser( user?.id )) return

    const walletParams: WalletParams = await this.walletInfoSvc.get( showLoading )

    // If user has not verified Data and Email, redirect to profile
    if ( !walletParams?.verified?.mandatory )
    {
      await this.userSvc.showAlertToRedir();
      return;
    }

    const sendTksModal = await this.modalCtrl.create({
      component: SendComponent,
      componentProps: {
        title,
        asset: walletParams?.userWallets?.[0] ?? null, // If walletParams or userWallets is undefined or userWallets is empty, set asset to null
        user,
        retainedTks: walletParams?.retainedTks ?? null, // If walletParams or retainedTks is undefined, set retainedTks to null
        assetsMaxDecimals: walletParams?.assetsMaxDecimals ?? null, // If walletParams or assetsMaxDecimals is undefined, set assetsMaxDecimals to null

        returnBalance: true,
        hideWarning: true,
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
      // return 
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
