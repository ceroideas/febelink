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
    return (await this.api._createData('admin/getTokensUsers',formData)).toPromise();
  }

  async deleteTokensUser(id:number){
    const formData = new FormData();
    formData.append('id', id.toString());
    return (await this.api._createData('admin/deleteTokesUser',formData)).toPromise();
  }
  
  async editTokesUser(tokensUser:TokensUser){
    const formData = new FormData();
    formData.append('id', tokensUser.id.toString());
    formData.append('num_tokens', tokensUser.num_tokens.toString());
    formData.append('phase_tokens', tokensUser.phase_tokens.toString());
    formData.append('payed_date', tokensUser.payed_date || '');
    return (await this.api._createData('admin/editTokesUser',formData)).toPromise();
  }

}
