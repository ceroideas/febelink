import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/currency.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TwoFAComponent } from 'src/app/components/two-fa/two-fa.component';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { WalletService } from 'src/app/services/wallet/wallet.service';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {

    @Input() asset: CryptoCurrency;
    @Input() user: IUser;
    @Input() retainedTks: TokensUser[];
    @Input() returnBalance: boolean = false;
    @Input() assetsMaxDecimals: number = 7;

    // Value to send predefined
    @Input() amount: number;
    // If user can or cannot change the amount
    @Input() canModify: boolean = true;

    public form: FormGroup;
    isLoading: boolean;
    calcs: {
          retained?: number
        , send?: number
        , diff?: number
        , max?: number
    } = {};
    publicKey: string;

    constructor(
          private formBuilder: FormBuilder
        , private modalCtrl: ModalController
        , private popCtrl: PopoverController
        , private wallet: WalletService
        , public utils: UtilitiesService
        , private translateSvc: TranslateConfigService
    ) {}

    ngOnInit() {
      this.calcLimits();      
      this.buildForm();
    }

    calcLimits() {
        this.calcs.retained = 0;
        this.retainedTks?.forEach( tk => this.calcs.retained += Number( tk?.num_tokens || '0' ));

        this.calcs.max = this.asset?.amount - this.calcs.retained;
    }

    ionViewDidLeave() {
      this.form?.reset();
    }

    getValues() {

    }
  
    buildForm() {
      this.form = this.formBuilder.group({
        amount: new FormControl({ value: this.amount || '', disabled: !this.canModify }, [ Validators.required ]),
        publicKey: new FormControl({ value: this.user?.public || '', disabled: this.user }, [ Validators.required ])
      });
    }

    onDismiss( ) {
        this.modalCtrl.dismiss({ });
    }

    calc( amount: number ) {
        this.calcs.send = amount;
        this.calcs.diff = this.calcs.max - amount;
    }

    async send() {
        if( !this.checkErrors() ) return;
    
        /* Verify 2FA */
        const verified = await this.verify2FA();
        
        if( verified ) {
            try {
                const res = await this.wallet.send(
                    this.publicKey,
                    this.asset.assetId,
                    this.calcs.send,
                    this.returnBalance
                );
                await this.utils.dismissLoading();
                
                // Had Error
                if( res.status != 200 ) {
                    this.utils.showAlert( null, res.message );
                    return;
                }

                // Show success message
                this.utils.showToast( res.message );
                this.modalCtrl.dismiss({ asset: this.asset, response: res });
            } catch( ex ) {
              await this.utils.dismissLoading();
              // ToDo: Handle Stellar error Statuses
              alert("No se pudo realizar la transaccion, muy probablemente porque no posee los fondos necesarios. Si considera que esto es incorrecto, contacte con soporte@febelink.com");
            }
        }
    }

    checkErrors(): boolean {
        const { publicKey } = this.form.value;
        
        if(( this.asset?.amount || 0 ) - this.calcs.retained <= 0 ) {
            this.utils.showToast( this.translateSvc.instant( 'pages.wallet.error.cant-send' ));
            return;
        }

        if( !this.calcs.send || this.calcs.send <= 0 ) {
            this.utils.showToast( this.translateSvc.instant( 'pages.wallet.error.qSend' ));
            return false;
        }
        
        if( this.calcs.diff < 0 ) {
            this.utils.showToast( this.translateSvc.instant( 'pages.wallet.error.minSend' ));
            return false;
        }
        
        this.publicKey = this.user?.public || publicKey;
        if( !this.publicKey || this.publicKey?.length == 0 ) {
            this.utils.showToast( this.translateSvc.instant( 'pages.wallet.error.public-key' ));
            return false;
        }
    
        return true;
    }

    /* Verify 2FA PopoverControll */
    async verify2FA(): Promise<any> {
        const twoFApop = await this.popCtrl.create({
            component: TwoFAComponent,
            cssClass: 'pop-mobile-width',
            backdropDismiss: false // To prevent user cancel on touch outside by error
        });
        await twoFApop.present();
    
        const { data } = await twoFApop.onDidDismiss();
        return new Promise( resolve => { resolve( data?.verified )});
    }

    copyPublic( publicKey: string ) {
        this.utils.copyClipboard( publicKey );
    }
}
