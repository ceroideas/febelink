import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { IUser } from 'src/app/models/user.model';
import { KYCAliceService } from 'src/app/services/kyc.alice.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { KYC_Country, KYC_DOCtype, KYC_ERR_Validation } from 'src/app/models/kyc.alice.model';

import * as aliceonboarding from 'aliceonboarding';
import { Onboarding, OnboardingConfig, DocumentType } from "aliceonboarding";
import "aliceonboarding/dist/aliceonboarding.css";

@Component({
  selector: 'app-kyc-alice',
  templateUrl: './kyc-alice.component.html',
  styleUrls: ['./kyc-alice.component.scss'],
})
export class KYCAliceComponent implements OnInit {
  
  @Input() requestSelfie: boolean = true;
  @Input() email: string;
  @Input() name: string;
  @Input() lastName: string;

  @Output() onSuccess: EventEmitter<ILang> = new EventEmitter();
  @Output() onCancellation: EventEmitter<ILang> = new EventEmitter();

  currentUser: IUser;
  
  creating: boolean = false;
  done: boolean = false;

  userToken: string;

  SANDBOX_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpc3N1ZXItc2FuZGJveCIsInR5cCI6IlNBTkRCT1giLCJleHAiOjE2NDE1NjQyNDMsImlhdCI6MTYzNjM4MDI0MywiY2xpIjoiZmViZWxpbmstdHJpYWwifQ.LRnJX4GWcqKy-DWgLte6_4p8loIbpNFPJPf36gZNT5bYZVost3iKzbXH-7-WDiwVlPlVdnQ55pgQf0hFeLLJ3U03XwlqYKiaf1q0iwRetEpeM1V1jm3E1HOZ_-1A2i5MfxRpy0mJ2j6wy_omOPgZRe5FV23xsZW6yba9CKAfntNdaAf0ETJoP-0tfFcEGEfpVdpIsBv_rUCmjh9PADEY1UCgmsGQbnMm7L1wgT-LL9jqUhlwXB2894N8C0ubG7s-EB5ve9dbcQhXVN1xdoBnklMONSmk74NnRvrA7qqKk8jecZT26InIJI8QQyKcY7hd6PrpFKeukfYZSD3t5XG0sA";

  
  //SEARCH COMPONENT
  searchText: string = '';
  keyText: string = '';
  keys: any = [];
  openKeys: boolean = false;
  selectorEnabled: boolean = false;
  showCookies = false;
  refreshTab: any;

  isLoading: boolean = false;
  countryLoadingClicked: boolean = false;
  nothingFound: boolean = false;
  subscription = null;
  cntrySelected: KYC_Country;
  docTypes = KYC_DOCtype;
  docTypeSelected: KYC_DOCtype

  showCard: boolean = false;
  errorMsg: string;

  constructor(
      public popoverController: PopoverController
    , private translateService: TranslateConfigService
    , private utilities: UtilitiesService
    , private kycAliceService: KYCAliceService
    , private alertCtrl: AlertController ) { }

  async ngOnInit() {
    this.currentUser = { ...(await this.utilities.getUserData()) };
  }

  getUserInfo() {
    const email = this.email || this.currentUser.email;
    const name = this.name || this.currentUser.name;
    const lastName = this.lastName || this.currentUser.lastName;
    
    return {
      email: email,        // Mandatory
      firstName: name,     // Optional
      lastName: lastName,  // Optional
    }
  }

  
  /**
   * SELECT COUNTRY TO BE ABLE TO SELECT DOC TYPE TO START KYC
   */
  addCountryFocus() {
    this.selectorEnabled = true;

  }

  async searchCountry() {
    this.nothingFound = false;
    this.keys = [];

    if ( this.searchText === '' )
      this.selectorEnabled = true;

    // To remove listener of previous call
    if( this.subscription !== null )
      this.subscription.unsubscribe();

    if (( this.searchText.length > 2 ) && ( this.selectorEnabled )) {
      // To show on list the loading spinner
      this.keys.push({ name: 'Cargando...', value: 'loading' });

      this.subscription = ( await this.kycAliceService.getCountriesByKey( this.searchText )).subscribe(
        ( response ) => {
          this.kycAliceService.handleBackendToken( response );

          let keys = [];

          if( Object.keys( response.hierarchy ).length > 0 ) {
            for( const key in response.hierarchy ) {
              const country = response.hierarchy[ key ];
              let item: KYC_Country = {
                name: this.highlight( country.name ),
                value: country.name,
                countryISO: key,
                docTypes: country.document_types
              };

              keys.push( item );
            };
          } else
            this.nothingFound = true;
          
          this.countryLoadingClicked = false;
          this.keys = keys;
        },
        ( err ) => {
          this.onError( err );
        }
      );
    }
  }

  highlight( query ) {
    if ( !this.searchText ) {
      return query;
    }

    return query
      .toString()
      .replace(new RegExp(this.searchText, 'gi'), (match) => {
        return '<strong>' + match + '</strong>';
      });
  }

  removeCountryFocus() {
    setTimeout(() => {
      // To prevent cancel country search when Loading Countries Clicked
      if( this.countryLoadingClicked ) {
        this.countryLoadingClicked = false;
        return;
      }

      this.keyText = this.searchText;
      this.selectorEnabled = false;
      this.keys.length = 0;

      // To remove listener of previous call
      if( this.subscription !== null )
        this.subscription.unsubscribe();
    }, 500 );
  }

  clearBtn() {
    this.keys = [];
    this.cntrySelected = null;
  }

  detectKeyPressed(event) {
    if ((event.key === 'Enter') && ( this.searchText.length > 2 )) {
      this.showCard = true;
      setTimeout(() => {
        this.keys.length = 0;
      }, 500);
    }
  }

  async countrySelected( country: KYC_Country ) {
    // Prevent click on Loading spinner
    if( country.value == 'loading' ) {
      this.countryLoadingClicked = true;

      this.addCountryFocus();
      return;
    }

    this.keys = [];

    this.searchText = country.value;
    this.keyText = this.searchText;
    this.selectorEnabled = true;
    this.cntrySelected = country;
  }

  docSelected( docType: KYC_DOCtype ) {
    this.creating = true;

    this.getUserToken( docType, this.getUserInfo() );
  }

  restart() {
    this.creating = false;
    this.done = false;
    this.isLoading = false;
    this.errorMsg = null;
  }


  getUserToken( docType: KYC_DOCtype, userInfo ) {
    this.isLoading = true;

    let authenticator = new aliceonboarding.SandboxAuthenticator( this.SANDBOX_TOKEN, userInfo );
    authenticator.execute()
      .then(userToken => {
        this.userToken = userToken;
        this.aliceOnboarding( userToken, docType );
        
        this.isLoading = false;
      })
      .catch(error => {
        this.restart();
        this.isLoading = false;

        alert( /**"Please, add a valid SANDBOX_TOKEN (JavaScript)\n" +*/ error.toString() );
      })
  }
  
  // Out of maintenance, do not use Alice's welcome for now (until enabled)
  aliceOnboardingWelcome( userInfo, userToken, docType: KYC_DOCtype ) {
    new aliceonboarding.OnboardingWelcome( "alice-onboarding-mount", userInfo )
      .run(
        ( res ) => {
          this.aliceOnboarding( userToken, docType );
        },
        () => { this.onCancel(  ); }
    );
  }
  
  aliceOnboarding( userToken, docType: KYC_DOCtype ) {
    const config = this.setConfig( userToken, docType );
  
    new aliceonboarding.Onboarding( "alice-onboarding-mount", config )
      .run(
        ( userInfo ) => { this.onFinished( userInfo ); },
        ( err ) => { this.onError( err ); },
        () => { this.onCancel(  ); }
      );
  }

  setConfig( userToken: string, docType: KYC_DOCtype ) {
    this.docTypeSelected = docType;
    
    const lang: string = ILangDEFAULTS.getCurrentLang( this.translateService ).lang;

    const config = new aliceonboarding.OnboardingConfig()

      // Language
      .withCustomLocalization( lang );

    let documentType: DocumentType;
    // Type of Documents
    switch( docType ) {
      case KYC_DOCtype.ID:
        documentType = aliceonboarding.DocumentType.IDCARD;
        break;
      case KYC_DOCtype.PASSPORT:
        documentType = aliceonboarding.DocumentType.PASSPORT;
        break;
      case KYC_DOCtype.RESIDENCE:
        documentType = aliceonboarding.DocumentType.RESIDENCEPERMIT;
        break;
      case KYC_DOCtype.DRIVER:
        documentType = aliceonboarding.DocumentType.DRIVERLICENSE;
        break;
    }
    
    // Load Document By FILE EXPLORER || CAMERA
    let documentStageConfig = new aliceonboarding.DocumentStageConfig(
      aliceonboarding.DocumentCapturerType.ALL, true, aliceonboarding.CameraType.BACK
    );
    config.withAddDocumentStage( documentType, this.cntrySelected.countryISO, documentStageConfig );
    
    // Requieres Selfie validation
    config.withAddSelfieStage();

    // This token identifies each user ( Will create a new one unless already exists )
    config.withUserToken( userToken );

    return config;
  }

  async onFinished( res ) {
    this.isLoading = true;

    (await this.kycAliceService.checkLifeProof( res.user_id, this.docTypeSelected, false )).subscribe(
      ( response ) => {
        if( !response.isValid )
          this.errOnLifeProof( response );
        else
          this.dismiss({ isValidated: true });

        this.isLoading = false;
      },
      ( err ) => {
        this.onError( err );
      }
    )
  }

  errOnLifeProof( response: KYC_ERR_Validation ) {
    let msg = '<h4>' + this.translateService.instant( 'kyc.errors.title' ) + '</h4>';

    /** Error With Document */
    if( !response.document )
      msg += '<br><br>' + this.translateService.instant( 'kyc.errors.document.none' );
    else if( !response.document.isValid ) {
      if( !response.document.backHasFields )
        msg += '<br>' + this.translateService.instant( 'kyc.errors.document.backFields' );

      if( !response.document.frontHasFields )
        msg += '<br>' + this.translateService.instant( 'kyc.errors.document.frontFields' );

      if( !response.document.allFieldsOK ) {
        msg += '<br><br>' + this.translateService.instant( 'kyc.errors.document.err' ) + '<br><ul>';
        
        if( !response.document.nameOK )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.name' ) + '</li>';
        if( !response.document.surnameOK )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.surname' ) + '</li>';
        if( !response.document.birthOK )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.birthdate' ) + '</li>';
        /* if( !response.document.isOver18 )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.legal_age' ) + '</li>'; */
        if( response.document.dateExpired )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.expire' ) + '</li>';
        if( !response.document.docNumberOK )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.number' ) + '</li>';
        
        if( !response.document.consistentDoc )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.consistent' ) + '</li>';
        if( !response.document.expectedDoc )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.expected' ) + '</li>';

        msg += '</ul>';
      }
    }

    /** Error With Selfie */
    if( !response.selfie )
      msg += '<br><br>' + this.translateService.instant( 'kyc.errors.selfie.none' );
    else if( !response.selfie.isValid ) {
      msg += '<br><br>' + this.translateService.instant( 'kyc.errors.selfie.err' ) + '<br><ul>';
      if( !response.selfie.isRealPerson )
        msg += '<li>' + this.translateService.instant( 'kyc.errors.selfie.is_real' ) + '</li>';
      if( !response.selfie.hasFaceMatching )
        msg += '<li>' + this.translateService.instant( 'kyc.errors.selfie.face_match' ) + '</li>';

      msg += '</ul>';
    }

    this.errorMsg = msg;
  }

  onError( err ) {
    console.error("Onboarding error. Error: ", JSON.stringify( err.toString()));
    this.done = false;

    this.retryAlert(
      this.translateService.instant( 'kyc.errors.alice.title' ),
      this.translateService.instant( 'kyc.errors.alice.message' )
    );
  }

  onCancel() {
    // console.log("Onboarding was canceled by the user");
    this.done = false;

    this.dismiss({ isValidated: false });
  }

  async retryAlert( title, msg ) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'RE-INTENTAR',
          handler: () => {
            alert.dismiss();
            this.restart();
          }
        },
        {
          text: 'VOLVER',
          handler: () => {
            if( this.onCancellation )
              this.onCancellation;

            this.dismiss({ isValidated: false });
          }
        }
      ]
    });

    await alert.present();
  }

  dismiss( result ) {
    this.popoverController.dismiss({ result })
  }
}
