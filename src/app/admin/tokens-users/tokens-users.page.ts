import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TokensUsersService } from 'src/app/admin/services/tokens-users.service';
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
    , private modalCtrl:ModalController
    ) { }

  tokensUsers:TokensUser[]

  async ngOnInit() {
    this.tokensUsers = await this.tokensUsersSvc.getTokensUsers()
  }

  async search(event: any) {
    const filter = event.target.value;
    this.tokensUsers = await this.tokensUsersSvc.getTokensUsers(filter);
  }

  async edit(tokensUser:TokensUser){
    const suscribirseModal = await this.modalCtrl.create({
      component: EditTokensComponent,
      componentProps:{
        tokensUser
      }
    });
    await suscribirseModal.present();
  }

  delete(id:number){
    
  }

}