import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as aliceonboarding from 'aliceonboarding';
import { Onboarding, OnboardingConfig, DocumentType } from "aliceonboarding";
import "aliceonboarding/dist/aliceonboarding.css";
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { IUser } from 'src/app/models/user.model';
import { KYCAliceService } from 'src/app/services/kyc.alice.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { KYC_Country, KYC_DOCtype, KYC_ERR_Validation } from './alice.model';

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
    , private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.currentUser = { ...(await this.utilities.getUserData()) };
  }

  
  //SEARCH COMPONENT
  searchText: string = '';
  keyText: string = '';
  keys: any = [];
  openKeys: boolean = false;
  selectorEnabled: boolean = false;
  showCookies = false;
  refreshTab: any;
  
  publishSearchForm: FormGroup;

  isLoading: boolean = false;
  nothingFound: boolean = false;
  subscription = null;
  cntrySelected: KYC_Country;
  docTypes = KYC_DOCtype;
  docTypeSelected: KYC_DOCtype

  showCard: boolean = false;

  //NEW SEARCH COMPONENT
  addFocus() {
    this.selectorEnabled = true;
  }

  async search() {
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

              console.log( item );
              keys.push( item );
            };
          } else
            this.nothingFound = true;
          
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

  removeFocus() {
    setTimeout(() => {
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
      this.addFocus();
      return;
    }

    console.log( 'countrySelected: ', country );
    this.keys = [];

    this.searchText = country.value;
    this.keyText = this.searchText;
    this.selectorEnabled = true;
    this.cntrySelected = country;
  }

  docSelected( docType: KYC_DOCtype ) {
    this.creating = true;

    this.getUserToken( docType, {
      email: this.email,           // Mandatory
      firstName: 'Abdias Natanael',   // Optional
      lastName: 'Vrech'      // Optional
    });
  }











  onEmail( email ) {
    this.email = email;
  }
  restart() {
    this.creating = false;
    this.done = false;
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
        alert("Please, add a valid SANDBOX_TOKEN (JavaScript)\n" + error.toString());
        console.log( 'error: ', error.toString() );

      this.isLoading = false;
      })
  }
  
  // Fuera de mantenimiento, no utilizar de momento la bienvenida de Alice ( hasta que lo habiliten )
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
    (await this.kycAliceService.checkLifeProof( res.user_id, this.docTypeSelected )).subscribe(
      ( response ) => {
        console.log( 'response: ', response );

        if( !response.isValid )
          this.errOnLifeProof( response );
        else
          this.utilities.showToast( 'Verificacion de Vida exitosa' );

        this.utilities.dismissLoading();
      },
      ( err ) => {
        this.onError( err );
      }
    )
  }

  errOnLifeProof( response: KYC_ERR_Validation ) {
    let title = 'Tienes errores en la validación de Prueba de Vida\n';
    let msg = '';

    /** Error With Document */
    if( !response.document )
      msg += '\n' + 'No ha cargado un documento para validar';
    else if( !response.document.isValid ) {
      if( !response.document.backHasFields )
        msg += '\n' + 'No he podido corroborar ningun campo de la parte trasera del documento';

      if( !response.document.frontHasFields )
        msg += '\n' + 'No he podido corroborar ningun campo de la parte frontal del documento';

      if( !response.document.allFieldsOK ) {
        msg += '\n' + 'Checkea que los siguientes campos del Documento no tengan problemas:';
        if( !response.document.nameOK )
          msg += '\n' + 'Nombre';
        if( !response.document.surnameOK )
          msg += '\n' + 'Apellido';
        if( !response.document.birthOK )
          msg += '\n' + 'Fecha de Nacimiento';
        /* if( !response.document.isOver18 )
          msg += '\n' + 'Mayoria de Edad'; */
        if( response.document.dateExpired )
          msg += '\n' + 'Fecha de Caducidad';
        if( response.document.docNumberOK )
          msg += '\n' + 'Numero de Documento';
      }
    }

    /** Error With Selfie */
    if( !response.selfie )
      msg += '\n' + 'No ha realizado la prueba de Selfie';
    else if( !response.selfie.isValid ) {
      msg += '\n' + 'Los errores con respecto a la Selfie son:';
      if( !response.selfie.isRealPerson )
        msg += '\n' + 'No ha pasado la prueba de suplantación ( imagenes impresas, videos en pantallas, mascaras, entre otras ) ';
      if( !response.selfie.hasFaceMatching )
        msg += '\n' + 'No se ha encontrado relacion entre la Selfie y la foto del documento';
    }

    this.retryAlert( title, msg );
  }

  onError( err ) {
    console.error("Onboarding error. Error: ", JSON.stringify( err.toString()));
    this.done = false;

    // this.utilities.dismissLoading();

    this.retryAlert( 'Parece que hubo un error', 'Desea reintentar para poder seguir con el proceso?' );
  }

  onCancel(  ) {
    console.log("Onboarding was canceled by the user");
    this.done = false;

    this.retryAlert( 'Para continuar debe completar la prueba de vida', 'Desea reintentar para poder seguir con el proceso?' );
  }

  home() {
    this.router.navigate(['menu/todas']);
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
            this.aliceOnboarding( this.userToken, this.docTypeSelected );
          }
        },
        {
          text: 'VOLVER',
          handler: () => {
            this.utilities.showToast( 'GoBack callback missing' );
          }
        }
      ]
    });

    await alert.present();
  }
}
