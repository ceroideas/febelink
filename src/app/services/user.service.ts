import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IUser } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
      private router: Router
    , private api: ApiService
  ){}

  checkUserDataComplete(user: IUser) {
    // ToDo: control and replace with hasVerifiedMandatory()
    if ( user.dni && user.telefono && user.direccion && user.email_verified_at )
      return true;
    
    this.redir();
    return false;
  }

  async hasVerifiedMandatory(): Promise<boolean> {
    this.api.utilities.showLoading();
    const check = await this.verifiedMandatory();
    this.api.utilities.dismissLoading();

    return new Promise( resolve => resolve( check.verif || this.redir()) );
  }

  async hasVerifiedFull(): Promise<boolean> {
    this.api.utilities.showLoading();
    const check = await this.verifiedMandatory();
    this.api.utilities.dismissLoading();

    return new Promise( resolve => resolve( check.verif || this.redir()) );
  }

  async verifiedFull(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/full' )).toPromise();
  }

  async verifiedMandatory(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/mandatory' )).toPromise();
  }

  async verifiedPhone(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/phone' )).toPromise();
  }

  async verifiedAddress(): Promise<any> {
    return await ( await this.api._getData( 'verif/address' )).toPromise();
  }

  async verifiedEmail(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/email' )).toPromise();
  }

  async verifiedKyc(): Promise<any> {
    return await ( await this.api._getData( 'user/verif/kyc' )).toPromise();
  }

  redir() {
    const navigationExtras: NavigationExtras = {
      state: {msg: 'tabs.tab4.need-to-complete'}
    };
    this.router.navigate(['menu', 'perfil'], navigationExtras);
  }

  async showAlertToRedir() {
    await this.api.utilities.showAlert( null,
      this.api.utilities.translateService.instant( 'tabs.tab4.alert-need-to-complete' ), '', [
      { text: this.api.translateSvc.instant( 'common.no' ), role: 'cancel' },
      {
        text: this.api.translateSvc.instant( 'common.yes' ),
        handler: () => this.redir(),
      },
    ]);
  }
}
