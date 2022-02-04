import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { UtilitiesService } from '../utilities.service';

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
  
  authenticateUser( id , showLoading: boolean = true ) {
    if( showLoading )
      this.utilities.showLoading();

    const formData = new FormData();
    formData.append('id', id );
    
    const routes = this.route( KYCRoutes.BACKEND ) + 'authenticateUser';
    return this.api._createData( routes, formData );
  }
  
  verifyKYC( id, showLoading: boolean = true ) {
    if( showLoading )
      this.utilities.showLoading();

    const formData = new FormData();
    formData.append('id', id );
    
    const routes = this.route( KYCRoutes.CHECK ) + 'verifyKYC';
    return this.api._createData( routes, formData );
  }

  getUserReport( userId, showLoading: boolean = true ) {
    if( showLoading )
      this.utilities.showLoading();

    const routes = this.route( KYCRoutes.BACKEND ) + 'userReport/' + userId;
    return this.api._getData( routes );
  }
  

  checkLifeProof( userId, doc, showLoading: boolean = true ) {
    if( showLoading )
      this.utilities.showLoading();

      const formData = new FormData();
      formData.append('id', userId );
      formData.append('doc', doc );
      formData.append('check_selfie', environment.KYC_SELFIE ? '1' : '0' );

    const routes = this.route( KYCRoutes.CHECK ) + `verifyLifeProof`;
    return this.api._createData( routes, formData );
  }


  getCountriesByKey( key: string ) {
    const routes = `${ this.route( KYCRoutes.INFO ) }docsPerCountry/${ key }`;      
    return this.api._getData( routes );
  }
}
