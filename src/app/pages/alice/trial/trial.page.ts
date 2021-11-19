import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as aliceonboarding from 'aliceonboarding';
import { Onboarding, OnboardingConfig, DocumentType } from "aliceonboarding";
import "aliceonboarding/dist/aliceonboarding.css";
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { IUser } from 'src/app/models/user.model';
import { KYCAliceService } from 'src/app/services/kyc.alice.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AliceKYC } from './alice.model';

@Component({
  selector: 'app-trial',
  templateUrl: './trial.page.html',
  styleUrls: ['./trial.page.scss'],
})
export class TrialPage implements OnInit {

  currentUser: IUser;
  email: string = '';
  
  creating: boolean = false;
  done: boolean = false;

  // Doc Types
  type_id: boolean = true;
  type_passport: boolean = false;
  type_residence: boolean = false;
  type_driver: boolean = false;

  // Selfie
  selfie: boolean = false;

  userToken: string;

  SANDBOX_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpc3N1ZXItc2FuZGJveCIsInR5cCI6IlNBTkRCT1giLCJleHAiOjE2NDE1NjQyNDMsImlhdCI6MTYzNjM4MDI0MywiY2xpIjoiZmViZWxpbmstdHJpYWwifQ.LRnJX4GWcqKy-DWgLte6_4p8loIbpNFPJPf36gZNT5bYZVost3iKzbXH-7-WDiwVlPlVdnQ55pgQf0hFeLLJ3U03XwlqYKiaf1q0iwRetEpeM1V1jm3E1HOZ_-1A2i5MfxRpy0mJ2j6wy_omOPgZRe5FV23xsZW6yba9CKAfntNdaAf0ETJoP-0tfFcEGEfpVdpIsBv_rUCmjh9PADEY1UCgmsGQbnMm7L1wgT-LL9jqUhlwXB2894N8C0ubG7s-EB5ve9dbcQhXVN1xdoBnklMONSmk74NnRvrA7qqKk8jecZT26InIJI8QQyKcY7hd6PrpFKeukfYZSD3t5XG0sA";

  constructor(
      private utilities: UtilitiesService
    , private kycAliceService: KYCAliceService
    , private translateService: TranslateConfigService
    , private router: Router
  ) { }

  async ngOnInit() {
    this.currentUser = { ...(await this.utilities.getUserData()) };
  }

  
  //SEARCH COMPONENT
  searchText: string = '';
  keyText: string = '';
  keywords: any = {};
  keys: any = [];
  openKeys: boolean = false;
  selectorEnabled: boolean = false;
  showCookies = false;
  refreshTab: any;
  
  publishSearchForm: FormGroup;

  isLoading: boolean = false;
  showCard: boolean = false;

  //NEW SEARCH COMPONENT
  addFocus() {
    this.selectorEnabled = true;
  }

  async search() {
    console.log('SEARCH', this.searchText, this.selectorEnabled);
    if (this.searchText === '') {
      this.keys = [];
      this.selectorEnabled = true;
    }
    this.publishSearchForm.patchValue({nombre: this.searchText});
    /* if ((this.searchText.length > 2) && (this.selectorEnabled)) {
      (await this.api.searchByKeys(this.searchText)).subscribe((keywords) => {
        if (keywords.length !== 0) {
          let keys = [];
          for (let key of keywords) {
            let item = { name: this.highlight(key.keyword), value: key.keyword };
            keys.push(item);
          }
          this.keys = keys;
        }
        else {
          setTimeout(() => {
            this.selectorEnabled = false;
            this.showCard = true;
          }, 500);
        }
        console.log('keys', this.keys);
      });
    } */
  }

  removeFocus() {
    setTimeout(() => {
      this.keyText = this.searchText;
      this.selectorEnabled = false;
      this.keys.length = 0;
    }, 500);
  }

  clearBtn() {
    this.keywords = {};
    this.keys = [];
  }

  detectKeyPressed(event) {
    if ((event.key === 'Enter') && (this.searchText.length > 2)) {
      this.showCard = true;
      setTimeout(() => {
        this.keys.length = 0;
      }, 500);
    }
  }

  async countrySelected(key) {
    /* console.log('getSectorsByKeys');
    this.keys = [];

    (await this.api.getSectorsByKeys(key.value)).subscribe((keywords) => {
      console.log('keywords', keywords);
      this.searchText = key.value;
      this.keyText = this.searchText;
      this.keywords = keywords;
      this.selectorEnabled = true;
      this.publishSearchForm.patchValue({sector: this.keywords.main.sector_id});

      this.subSectors = [];
      this.loadSubSectors(this.keywords.main.sector_id);

      this.showCard = true;
      this.removeFocus();
      
      this.isLoading = false;
    }); */
  }











  onEmail( email ) {
    this.email = email;
  }
  onChecked( isChecked: boolean, type: string ) {
    switch( type ) {
      case 'id':
        this.type_id = isChecked;
        break;
      case 'passport':
        this.type_id = isChecked;
        break;
      case 'residence':
        this.type_id = isChecked;
        break;
      case 'driver':
        this.type_id = isChecked;
        break;
      case 'selfie':
        this.selfie = isChecked;
        break;
    }
  }
  onCreate() {
    if( this.email === '' ) {
      this.utilities.showToast( 'Debe indicar el email' );
      return;
    }

    this.creating = true;
    this.onUserInfo( this.setUserInfo( this.email, this.currentUser.name ));
  }
  restart() {
    this.creating = false;
    this.done = false;
  }

  setUserInfo( email: string, firstName?: string, lastName?: string ) {
    return {
      email: email,           // Mandatory
      firstName: firstName,   // Optional
      lastName: lastName      // Optional
    }
  }
  
  onUserInfo( userInfo?: any ) {
    let authenticator = new aliceonboarding.SandboxAuthenticator( this.SANDBOX_TOKEN, userInfo );
    authenticator.execute()
      .then(userToken => {
        this.userToken = userToken;
        this.aliceOnboardingWelcome( userInfo, userToken );
        // this.aliceOnboarding( userToken );
      })
      .catch(error => {
        alert("Please, add a valid SANDBOX_TOKEN (JavaScript)\n" + error.toString());
        console.log( 'error: ', error.toString() );
      })
  }
  
  // Fuera de mantenimiento, no utilizar de momento la bienvenida de Alice ( hasta que lo habiliten )
  aliceOnboardingWelcome( userInfo, userToken ) {
    new aliceonboarding.OnboardingWelcome( "alice-onboarding-mount", userInfo )
      .run(
        ( res ) => {
          this.aliceOnboarding( userToken );
        },
        () => { this.onCancel(  ); }
    );
  }
  
  aliceOnboarding( userToken ) {
    console.log( 'userToken: ', userToken );
    const config = this.setConfig( userToken );
  
    new aliceonboarding.Onboarding( "alice-onboarding-mount", config )
      .run(
        ( userInfo ) => { this.onFinished( userInfo ); },
        ( err ) => { this.onError( err ); },
        () => { this.onCancel(  ); }
      );
  }

  setConfig( userToken?: string ) {
    const lang: string = ILangDEFAULTS.getCurrentLang( this.translateService ).lang;

    let documentStageConfig = new aliceonboarding.DocumentStageConfig(
      aliceonboarding.DocumentCapturerType.ALL, true, aliceonboarding.CameraType.BACK
    );

    const config = new aliceonboarding.OnboardingConfig()
      // Load Document By FILE EXPLORER || CAMERA
      .withAddDocumentStage( aliceonboarding.DocumentCapturerType.ALL )

      // Language
      .withCustomLocalization( lang );

    // Type of Documents
    if( this.type_id )
      config.withAddDocumentStage( aliceonboarding.DocumentType.IDCARD, null, documentStageConfig );
    if( this.type_passport )
      config.withAddDocumentStage( aliceonboarding.DocumentType.PASSPORT, null, documentStageConfig );
    if( this.type_residence )
      config.withAddDocumentStage( aliceonboarding.DocumentType.RESIDENCEPERMIT, null, documentStageConfig );
    if( this.type_driver )
      config.withAddDocumentStage( aliceonboarding.DocumentType.DRIVERLICENSE, null, documentStageConfig );
      
    if( this.selfie )
      config.withAddSelfieStage();

    if( userToken )
      config.withUserToken( userToken );

    return config;
  }

  async onFinished( res ) {
    console.log("Onboarding complete. User info: " + JSON.stringify( res ));
    
    (await this.kycAliceService.validateUser( res.user_id )).subscribe(
      ( response ) => {
        this.kycAliceService.handleBackendToken( response );

        console.log( 'response: ', response );

        this.utilities.dismissLoading();
      },
      ( err ) => {
        this.onError( err );
      }
    )
  }

  onError( err ) {
    console.error("Onboarding error. Error: " + err.toString());
    this.done = false;

    this.utilities.dismissLoading();
  }

  onCancel(  ) {
    console.log("Onboarding was canceled by the user");
    this.done = false;
  }

  home() {
    this.router.navigate(['menu/todas']);
  }
}
