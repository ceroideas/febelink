import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';

enum KYCRoutes {
      AUTH = 'auth'
    , BACKEND = 'backend'
    , CLIENT_SDK = 'clientsdk'
    , INFO = 'info'
    , CHECK = 'check'
}

@Injectable({
  providedIn: 'root'
})
export class KYCAliceService {

  // On first call to the api will get it
  // ( to avoid creating it again )
  backendToken: string;

  constructor(
    private utilities: UtilitiesService
    , private api: ApiService
  ) { }

  private route( kycRoute: KYCRoutes ) {
    return `kyc/${ kycRoute }/`;
  }

  handleBackendToken( response ) {
    if( response.backend_token )
      this.backendToken = response.backend_token;
  }
  

  validateUser( userId, showLoading: boolean = true ) {
    if( showLoading )
      this.utilities.showLoading();

    const routes = this.route( KYCRoutes.BACKEND ) + 'userReport/' + userId;
      console.log( 'routes: ', routes );
      
    return this.api._getData( routes );
  }


  
}
