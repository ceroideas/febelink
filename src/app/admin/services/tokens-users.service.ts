import { Injectable } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ApiService } from '../../services/api.service';
import { TokensUser } from '../models/tokens-user';

@Injectable({
  providedIn: 'root'
})
export class TokensUsersService {

  constructor(
      private api: ApiService
    , private utilities: UtilitiesService
  ) { }

  async getTokensUsers( activePage: number, filter?:string ){
    const formData = new FormData();
    formData.append( 'activePage', activePage + '' );
    if(filter) formData.append('filter', filter);
    return (await this.api._createData('admin/getTokensUsers',formData)).toPromise();
  }

  async getUsersByKey( activePage: number, keys?:string ) {
    const formData = new FormData();
    formData.append( 'activePage', activePage + '' );
    if( keys ) formData.append('keys', keys );
    return ( await this.api._createData( 'admin/getUsersByKey',formData )).toPromise();
  }

  async createTokenUser( tokenUser: TokensUser ){
    const formData = new FormData();
    formData.append( 'uid', tokenUser.id.toString() );
    formData.append( 'num_tokens', tokenUser.num_tokens.toString() );
    formData.append( 'phase_tokens', tokenUser.phase_tokens.toString() );
    formData.append( 'payed_date', tokenUser?.payed_date?.toString() || '' );
    return ( await this.api._createData( 'admin/createTokenUser',formData )).toPromise();
  }

  async deleteTokenUser(id:number){
    const formData = new FormData();
    formData.append('id', id.toString());
    return (await this.api._createData('admin/deleteTokenUser',formData)).toPromise();
  }
  
  async editTokenUser(tokensUser:TokensUser){
    const formData = new FormData();
    formData.append('id', tokensUser.id.toString());
    formData.append('num_tokens', tokensUser.num_tokens.toString());
    formData.append('phase_tokens', tokensUser.phase_tokens.toString());
    formData.append('payed_date', tokensUser.payed_date || '');
    return (await this.api._createData('admin/editTokenUser',formData)).toPromise();
  }

}
