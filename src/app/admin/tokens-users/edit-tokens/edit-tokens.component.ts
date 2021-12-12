import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TokensUser } from '../../models/tokens-user';
import { TokensUsersService } from '../../services/tokens-users.service';

@Component({
  selector: 'app-edit-tokens',
  templateUrl: './edit-tokens.component.html',
  styleUrls: ['./edit-tokens.component.scss'],
})
export class EditTokensComponent {

  constructor(
    private tokenSvc: TokensUsersService
    , private modalCtrl: ModalController
    , private utils: UtilitiesService
  ) { }

  @Input() tokensUser:TokensUser

  async accept(){
    console.log(this.tokensUser);
    try{
      if(!await this.utils.confirm('admin.tokensUsers.editModal', {name: this.tokensUser.name})) return;
      await this.tokenSvc.editTokesUser(this.tokensUser)
      this.modalCtrl.dismiss({updated: true});
    }
    catch(e){
      console.error(e);
      this.utils.showToast('Ha habido un error');
    }
  }
}
