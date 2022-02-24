import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateConfigService } from './translate/translate-config.service';

export interface IAlert {
    title?: string
  , titleParams?:any

  , message?: string, msg?: string
  , msgParams?:any
  
  , css?: string
  , buttons?: ( string | any )[], btns?: ( string | any )[]
  , inputs?: any[]

  , backdropDismiss?: boolean
}

@Injectable({
  providedIn: 'root',
})
export class AlertSvc {

    constructor(
        private alertCtrl: AlertController
        , private translateSvc: TranslateConfigService
    ) {}

    async show( params: IAlert, translate: boolean = false )
    {
        if( translate )
          this.translate( params );

        ( await this.alertCtrl.create({
            header:params?.title || ''
            , message: params?.message || params?.msg || ''
            , buttons: params?.buttons || params?.btns || [ 'OK' ]
            , inputs: params?.inputs || []
            , cssClass: params?.css || ''
            , backdropDismiss: params?.backdropDismiss
        })).present();
    }

    async confirm( params: IAlert ):Promise<boolean> {
      return new Promise(async resolve => {
        params.btns = [
          {
            text: 'common.buttons.cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve( false );
            }
          }, {
            text: 'common.buttons.confirm',
            handler: () => {
              resolve( true );
            }
          }
        ];
        this.show( params, true );
      });
    }

    private translate( params ) {
      params.title = !params.title ? null : this.translateSvc.instant( params.title, params.titleParams || [] );
      params.message = !params.message ? null : this.translateSvc.instant( params.message, params.msgParams || [] );
      params.msg = !params.msg ? null : this.translateSvc.instant( params.msg, params.msgParams || [] );

      if( params.buttons)
        params.buttons = this.translateBtns( params.buttons );
      if( params.btns)
        params.btns = this.translateBtns( params.btns );
    }

    private translateBtns( buttons: ( string | any )[] ) {
      buttons.forEach( button => {
        if( button instanceof Object )
          button.text = !button.text ? '' : this.translateSvc.instant( button?.text );
        
        if( typeof button === 'string' )
          button = !button ? '' : this.translateSvc.instant( button );
      });

      return buttons;
    }
}
