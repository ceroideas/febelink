import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { TokensUser } from 'src/app/admin/models/tokens-user';
import { TwoFAComponent } from 'src/app/components/two-fa/two-fa.component';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { ClipboardSvc } from 'src/app/services/clipboard.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { LoadingSvc } from 'src/app/services/loading.service';
import { AlertSvc } from 'src/app/services/alert.service';
import { InformSvc } from 'src/app/services/inform.service';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {

    @Input() title: string;
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
        , public clipboardSvc: ClipboardSvc
        , public toastSvc: ToastSvc
        , public loadingSvc: LoadingSvc
        , public alertSvc: AlertSvc
        , public informSvc: InformSvc
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

    private async doSend() {
        /* Verify 2FA */
        if( await this.verify2FA() )
            try {
                const res = await this.wallet.send(
                    this.publicKey,
                    this.asset.assetId,
                    this.calcs.send,
                    this.returnBalance,
                    this.user
                );
                await this.loadingSvc.dismiss();
                
                // Had Error
                if( res.status != 200 ) {
                    this.alertSvc.show({ msg: res.message });
                    return;
                }

                // Show success message
                this.toastSvc.show( res.message );
                this.modalCtrl.dismiss({ asset: this.asset, response: res });
            } catch( ex ) {
            await this.loadingSvc.dismiss();
            // ToDo: Handle Stellar error Statuses
            alert( ex.error.message );
            }
    }

    async send() {
        if( !this.checkErrors() ) return;
    
        this.informSvc.show({
            title: 'pages.wallet.send.alert.title'
            , description: 'pages.wallet.send.alert.message'
            , buttons: [
                {
                    text: 'common.buttons.cancel',
                    dismiss: true,
                }, {
                    text: 'common.buttons.confirm',
                    name: 'Confirm',
                    dismiss: true
                }
            ]
            , OnClick: button => {
                if( button.name == 'Confirm' )
                    this.doSend()
            }
        });
    }

    checkErrors(): boolean {
        const { publicKey } = this.form.value;
        
        if(( this.asset?.amount || 0 ) - this.calcs.retained <= 0 ) {
            this.toastSvc.show( 'pages.wallet.error.cant-send', true );
            return;
        }

        if( !this.calcs.send || this.calcs.send <= 0 ) {
            this.toastSvc.show( 'pages.wallet.error.qSend', true );
            return false;
        }
        
        if( this.calcs.diff < 0 ) {
            this.toastSvc.show( 'pages.wallet.error.minSend', true );
            return false;
        }
        
        this.publicKey = this.user?.public || publicKey;
        if( !this.publicKey || this.publicKey?.length == 0 ) {
            this.toastSvc.show( 'pages.wallet.error.public-key', true );
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
}
