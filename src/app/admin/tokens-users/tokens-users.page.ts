import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TokensUsersService } from 'src/app/admin/services/tokens-users.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TokensUser } from '../models/tokens-user';
import { EditTokensComponent } from './edit-tokens/edit-tokens.component';

@Component({
  selector: 'app-tokens-users',
  templateUrl: './tokens-users.page.html',
  styleUrls: ['./tokens-users.page.scss'],
})
export class TokensUsersPage implements OnInit {

  constructor(
    private tokensUsersSvc:TokensUsersService
    , public modalCtrl:ModalController
    , public utils:UtilitiesService
    ) { }

  tokensUsers:TokensUser[]

  async ngOnInit() {
    this.tokensUsers = await this.tokensUsersSvc.getTokensUsers()
  }

  filter:string;
  async search(event: any) {
    this.filter = event.target.value;
    this.tokensUsers = await this.tokensUsersSvc.getTokensUsers(this.filter);
  }

  async edit(tokensUser:TokensUser){
    const suscribirseModal = await this.modalCtrl.create({
      component: EditTokensComponent,
      componentProps:{
        tokensUser: {...tokensUser}
      }
    });
    await suscribirseModal.present();

    suscribirseModal.onDidDismiss().then(async (response) => {
      if(response?.data?.updated) this.tokensUsers = await this.tokensUsersSvc.getTokensUsers(this.filter);
    })
  }

  async delete(tokensUser:TokensUser){
    try{
      if(!await this.utils.confirm('admin.tokensUsers.deleteModal', {name: tokensUser.name})) return;
      await this.tokensUsersSvc.deleteTokensUser(tokensUser.id);
      this.utils.showToast('Tokens eliminados');
      this.tokensUsers = await this.tokensUsersSvc.getTokensUsers(this.filter);
    }
    catch(e){
      this.utils.showToast('No se pudo eliminar');
    }
  }

}