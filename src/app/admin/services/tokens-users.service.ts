import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TokensUser } from '../models/tokens-user';

@Injectable({
  providedIn: 'root'
})
export class TokensUsersService {

  constructor(
    private api: ApiService
  ) { }

  async getTokensUsers(filter?:string){
    const formData = new FormData();
    if(filter) formData.append('filter', filter);
    return (await this.api._createData('getTokensUsers',formData)).toPromise();
  }

  async deleteTokensUser(id:number){
    const formData = new FormData();
    formData.append('id', id+'');
    return (await this.api._createData('deleteTokesUser',formData)).toPromise();
  }
  
  async editTokesUser(tokensUser:TokensUser){
    const formData = new FormData();
    formData.append('id', tokensUser.id+'');
    formData.append('num_tokens', tokensUser.num_tokens);
    formData.append('phase_tokens', tokensUser.phase_tokens);
    formData.append('payed_date', tokensUser.payed_date);
    return (await this.api._createData('editTokesUser',formData)).toPromise();
  }

}
