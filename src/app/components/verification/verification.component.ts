import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {

  verifWhich = VerifWhich;
  which: VerifWhich | undefined;
  id: string| undefined;
  email: string | undefined;
  verifSent: boolean = false;
  hasError: boolean = false;

  form: UntypedFormGroup | undefined;
  
  constructor(
    public alertCtrl: AlertController,
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    private utilities: UtilitiesService,
    private modalCtrl: ModalController,
    private translateService: TranslateConfigService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [ this.id ],
      email: [ this.email ]
    });
  }

  /**
   * Metido a mano campos para enviarlos al servidor
   */
  async submit() {
    if ( this.email === '' )
      this.utilities.showToast(
        this.translateService.instant('tabs.tab4.errors.mailEmpty')
      );
    else
      this.verifyEmail();
  }

  /**
   * To Verify User Email
   */
  public async verifyEmail() {
    const email = this.form?.get('email')?.value;
    const msg = this.translateService.instant( 'common.verif.email.sending', { email: email });
    this.utilities.showLoading( msg );

    (await this.api.verifyEmail( Number(this.id), email )).subscribe(
      (resp) => {
        this.verificationEmailSent( resp );

        this.utilities.dismissLoading();
      },
      (err) => {
        if ( err.status == 406 )
          this.utilities.showToast(
            this.translateService.instant('tabs.tab4.errors.mail')
          );
        else if ( err.status == 409 )
          this.utilities.showToast(
            this.translateService.instant('tabs.tab4.errors.mailExists')
          );
        else
          this.utilities.showToast( this.translateService.instant( 'common.verif.email.error' ));
        
        this.hasError = true;

        this.utilities.dismissLoading();
      }
    );
  }

  public verificationEmailSent( resp : any) {
    this.verifSent = true;
    const email = this.form?.get('email')?.value;

    this.saveEmail( email );
    this.closeModal();

    const message = this.translateService.instant( 'common.verif.email.message', { email: email });
    this.utilities.showToast( message );
  }

  async saveEmail( email: any ) {
    const user = await this.utilities.getUserData();
    user.email = email;
    await this.utilities.saveUserData( user );
  }

  closeModal() {
    const email = this.form?.get('email')?.value;
    this.modalCtrl.dismiss({ email: email, hasError: this.hasError, verifSent: this.verifSent });
  } 

}

export enum VerifWhich {
    Email = 1
  , KYC = 2
  , Save = 3
}
