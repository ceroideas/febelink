import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IUser } from 'src/app/models/user.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { TokenCRUD, TokenPhase, TokensUser } from '../../models/tokens-user';
import { TokensUsersService } from '../../services/tokens-users.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertSvc } from 'src/app/services/alert.service';
import { ToastSvc } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-tokens',
  templateUrl: './edit-tokens.component.html',
  styleUrls: ['./edit-tokens.component.scss'],
})
export class EditTokensComponent implements OnInit {

  tkCRUD = TokenCRUD;
  @Input() tokenCRUD: TokenCRUD = TokenCRUD.Update;
  @Input() tokensUser: TokensUser;

  @Input() tkPhases: TokenPhase[];

  title: string;
  isLoading: boolean = false;
  loadingMsg: string;
  usersList: IUser[];
  tokensForm: UntypedFormGroup;

  constructor(
      private tokenSvc: TokensUsersService
    , public modalCtrl: ModalController
    , private alertSvc: AlertSvc
    , private toastSvc: ToastSvc
    , private translateSvc: TranslateConfigService
    , private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.loadingMsg = this.translateSvc.instant( 'common.labelSearching' );
    switch( this.tokenCRUD ) {
      case TokenCRUD.Create:
        this.title = this.translateSvc.instant( 'admin.tokensUsers.create' );
        break;
      case TokenCRUD.Update:
        this.builtForm();
        this.title = this.translateSvc.instant( 'admin.tokensUsers.update',
          { name: this.tokensUser?.name || this.tokensUser?.nick, surname: this.tokensUser?.lastname || '' }
        );
        break;
    }
  }

  ionViewDidLeave() {
    this.tokensForm?.reset();
  }

  builtForm() {
    this.tokensForm = this.formBuilder.group({
      name: new UntypedFormControl({ value: this.tokensUser?.name || this.tokensUser?.nick, disabled: true }),
      lastname: new UntypedFormControl({ value: this.tokensUser?.lastname, disabled: true }),
      email: new UntypedFormControl({ value: this.tokensUser?.email, disabled: true }),
      dni: new UntypedFormControl({ value: this.tokensUser?.dni, disabled: true }),
      num_tokens: new UntypedFormControl({ value: this.tokensUser?.num_tokens, disabled: false }, Validators.required ),
      id_phase_tokens: new UntypedFormControl({ value: this.tokensUser?.id_phase_tokens, disabled: false }, Validators.required ),
      retained: new UntypedFormControl({ value: this.tokenCRUD == TokenCRUD.Create ? true : this.tokensUser?.retained, disabled: true }),
      date: new UntypedFormControl({ value: this.tokensUser?.date, disabled: false }),
      payed_date: new UntypedFormControl({ value: this.tokensUser?.payed_date, disabled: false }),
      obs: new UntypedFormControl({ value: this.tokensUser?.observations, disabled: false })
    });
  }

  keys:string;
  async search( event?: any ) {
    this.isLoading = true;
    this.keys = event?.target?.value || this.keys || '';

    const response = await this.tokenSvc.getUsersByKey( this.activePage, this.keys );
    this.usersList = response.items;
    this.totalRecords = response.totalRecords;
    this.recordsPerPage = response.limit;
    this.qPages = response.qPages;

    this.isLoading = false;
  }

  userSelected( user ) {
    if( this.isLoading ) { this.showToastLoading(); return; }

    this.tokensUser = <TokensUser> user;
    this.builtForm();
  }

  phaseChange( event ){
    this.tokensUser.id_phase_tokens = event.detail.value;
    const phaseTk = this.getPhase( this.tokensUser.id_phase_tokens );
    this.tokensUser.phase_tokens = phaseTk?.phase_tokens;
    this.tokensForm.controls.date.setValue( phaseTk?.date || '' );
  }

  getPhase( id_phase_tokens ): TokenPhase {
    for( let i = 0; id_phase_tokens && i < this.tkPhases.length; i++ ) {
      const tkPhase = this.tkPhases[ i ];
      if( tkPhase.id == id_phase_tokens )
        return tkPhase;
    }

    return null;
  }

  async accept() {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    }
    if (!this.tokensUser?.retained && this.tokenCRUD !== TokenCRUD.Create) {
      this.toastSvc.show( 'admin.tokensUsers.error.retained', true );
      return;
    }

    const { num_tokens, id_phase_tokens, date, payed_date, obs } = this.tokensForm.value;
    this.tokensUser.num_tokens = num_tokens;
    this.tokensUser.id_phase_tokens = id_phase_tokens;
    this.tokensUser.date = date;
    this.tokensUser.payed_date = payed_date;
    this.tokensUser.observations = obs;

    if( !num_tokens ) {
      this.toastSvc.show( 'admin.tokensUsers.error.num_tokens', true );
      return;
    }
    if( !id_phase_tokens ) {
      this.toastSvc.show( 'admin.tokensUsers.error.phase_tokens', true );
      return;
    }

    const crud = this.translateSvc.instant( this.tokenCRUD );
    try{
      if( !await this.alertSvc.confirm({
          title: 'admin.tokensUsers.modal.header',
          titleParams: { CRUD: crud },
          msg: 'admin.tokensUsers.modal.body',
          msgParams: {
            CRUD: crud,
            name: this.tokensUser?.name || this.tokensUser?.nick,
            extra: ''
          }
        })) return;

      this.loadingMsg = crud + '...';
      this.isLoading = true;
      switch( this.tokenCRUD ) {
        case TokenCRUD.Create:
          await this.tokenSvc.createTokenUser( this.tokensUser );
          break;
        case TokenCRUD.Update:
          await this.tokenSvc.editTokenUser( this.tokensUser );
          break;
      }

      this.isLoading = false;
      this.modalCtrl.dismiss({updated: true});
    }
    catch(e){
      this.isLoading = false;
      console.error(e);
      this.toastSvc.show( 'admin.tokensUsers.error.some', true );
    }
  }

  showToastLoading() {
    this.toastSvc.show( 'admin.tokensUsers.loading', true );
  }

  /* Pagination */
  totalRecords: number = 0;
  recordsPerPage: number = 1;
  qPages: number = 1;
  activePage: number = 1;
  displayActivePage( activePage:number ){  
    this.activePage = activePage;
    this.search();
  }
}
