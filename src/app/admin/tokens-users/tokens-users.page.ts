import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TokensUsersService } from 'src/app/admin/services/tokens-users.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TokenCRUD, TokensUser } from '../models/tokens-user';
import { EditTokensComponent } from './edit-tokens/edit-tokens.component';

@Component({
  selector: 'app-tokens-users',
  templateUrl: './tokens-users.page.html',
  styleUrls: ['./tokens-users.page.scss'],
})
export class TokensUsersPage implements OnInit {

  isLoading: boolean = false;

  constructor(
      private tokensUsersSvc:TokensUsersService
    , public modalCtrl:ModalController
    , public utils:UtilitiesService
    , private translateSvc: TranslateConfigService
    ) { }

  tokensUsers:TokensUser[]

  async ngOnInit() {
    this.search();
  }

  filter:string;
  async search(event?: any) {
    this.isLoading = true;
    this.filter = event?.target?.value || '';
    this.tokensUsers = await this.tokensUsersSvc.getTokensUsers(this.filter);
    this.isLoading = false;
  }

  async create() {
    const suscribirseModal = await this.modalCtrl.create({
      component: EditTokensComponent,
      componentProps:{
        tokenCRUD: TokenCRUD.Create
      }
    });
    await suscribirseModal.present();

    suscribirseModal.onDidDismiss().then(async (response) => {
      if(response?.data?.updated) this.search();
    })
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
      if(response?.data?.updated) this.search();
    })
  }

  async delete(tokensUser:TokensUser){
    try{
      if(!await this.utils.confirm( 'admin.tokensUsers.modal', {
        CRUD: this.translateSvc.instant( TokenCRUD.Delete ),
        name: tokensUser?.name || tokensUser?.nick,
        extra: this.translateSvc.instant( 'admin.tokensUsers.irreversible' )
      })) return;
      
      this.isLoading = true; 
      await this.tokensUsersSvc.deleteTokenUser(tokensUser.id);
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.delete.done' ));
       this.search();
    }
    catch(e){
      this.isLoading = false;
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.delete.error' ));
    }
  }

}