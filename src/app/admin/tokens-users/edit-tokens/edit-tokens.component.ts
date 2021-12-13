import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IUser } from 'src/app/models/user.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TokenCRUD, TokenPhase, TokensUser } from '../../models/tokens-user';
import { TokensUsersService } from '../../services/tokens-users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-tokens',
  templateUrl: './edit-tokens.component.html',
  styleUrls: ['./edit-tokens.component.scss'],
})
export class EditTokensComponent implements OnInit {

  tkCRUD = TokenCRUD;
  @Input() tokenCRUD: TokenCRUD = TokenCRUD.Update;
  @Input() tokensUser: TokensUser;

  tkPhases: TokenPhase[] = [
    { value: '1', label: 'landing.reserveTk.first' },
    { value: '2', label: 'landing.reserveTk.second' },
    { value: '3', label: 'landing.reserveTk.third' }
  ]

  title: string;
  isLoading: boolean = false;
  usersList: IUser[];
  tokensForm: FormGroup;

  constructor(
      private tokenSvc: TokensUsersService
    , public modalCtrl: ModalController
    , private utils: UtilitiesService
    , private translateSvc: TranslateConfigService
    , private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    switch( this.tokenCRUD ) {
      case TokenCRUD.Create:
        this.title = this.translateSvc.instant( 'admin.tokensUsers.create' );
        break;
      case TokenCRUD.Update:
        this.builtForm();
        this.title = this.translateSvc.instant( 'admin.tokensUsers.update',
          { name: this.tokensUser?.name || this.tokensUser?.nick, surname: this.tokensUser?.lastname }
        );
        break;
    }
  }

  ionViewDidLeave() {
    this.tokensForm.reset();
  }

  builtForm() {
    this.tokensForm = this.formBuilder.group({
      name: new FormControl({ value: this.tokensUser?.name || this.tokensUser?.nick, disabled: true }),
      lastname: new FormControl({ value: this.tokensUser?.lastname, disabled: true }),
      email: new FormControl({ value: this.tokensUser?.email, disabled: true }),
      dni: new FormControl({ value: this.tokensUser?.dni, disabled: true }),
      num_tokens: new FormControl({ value: this.tokensUser?.num_tokens, disabled: false }, Validators.required ),
      phase_tokens: new FormControl({ value: this.tokensUser?.phase_tokens?.toString(), disabled: false }, Validators.required ),
      payed_date: new FormControl({ value: this.tokensUser?.payed_date, disabled: false })
    });
  }

  keys:string;
  async search( event?: any ) {
    this.isLoading = true;
    this.keys = event?.target?.value || '';
    this.usersList = await this.tokenSvc.getUsersByKey( this.keys );
    this.isLoading = false;
  }

  userSelected( user ) {
    this.tokensUser = <TokensUser> user;
    this.builtForm();
  }

  phaseChange( event ){
    this.tokensUser.phase_tokens = event.detail.value;
  }

  async accept(){
    const { num_tokens, phase_tokens, payed_date } = this.tokensForm.value;
    this.tokensUser.num_tokens = num_tokens;
    this.tokensUser.phase_tokens = phase_tokens;
    this.tokensUser.payed_date = payed_date;

    if( !num_tokens ) {
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.error.num_tokens' ));
      return;
    }
    if( !phase_tokens ) {
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.error.phase_tokens' ));
      return;
    }

    try{
      if(!await this.utils.confirm( 'admin.tokensUsers.modal', {
        CRUD: this.translateSvc.instant( this.tokenCRUD ),
        name: this.tokensUser?.name || this.tokensUser?.nick,
        extra: ''
      })) return;

      switch( this.tokenCRUD ) {
        case TokenCRUD.Create:
          await this.tokenSvc.createTokenUser( this.tokensUser );
          break;
        case TokenCRUD.Update:
          await this.tokenSvc.editTokenUser( this.tokensUser );
          break;
      }

      this.modalCtrl.dismiss({updated: true});
    }
    catch(e){
      console.error(e);
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.error.some' ));
    }
  }
}
