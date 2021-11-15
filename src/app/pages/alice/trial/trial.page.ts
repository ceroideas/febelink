import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as aliceonboarding from 'aliceonboarding';
import { Onboarding, OnboardingConfig, DocumentType } from "aliceonboarding";
import "aliceonboarding/dist/aliceonboarding.css";
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AliceKYC } from './alice.model';

@Component({
  selector: 'app-trial',
  templateUrl: './trial.page.html',
  styleUrls: ['./trial.page.scss'],
})
export class TrialPage implements OnInit {

  email: string = '';
  name: string = '';
  surname: string = '';
  creating: boolean = false;
  done: boolean = false;

  // Doc Types
  type_id: boolean = true;
  type_passport: boolean = false;
  type_residence: boolean = false;
  type_driver: boolean = false;

  // Selfie
  selfie: boolean = false;

  welcomeButton;

  aliceKYC: AliceKYC;

  SANDBOX_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJpc3N1ZXItc2FuZGJveCIsInR5cCI6IlNBTkRCT1giLCJleHAiOjE2NDE1NjQyNDMsImlhdCI6MTYzNjM4MDI0MywiY2xpIjoiZmViZWxpbmstdHJpYWwifQ.LRnJX4GWcqKy-DWgLte6_4p8loIbpNFPJPf36gZNT5bYZVost3iKzbXH-7-WDiwVlPlVdnQ55pgQf0hFeLLJ3U03XwlqYKiaf1q0iwRetEpeM1V1jm3E1HOZ_-1A2i5MfxRpy0mJ2j6wy_omOPgZRe5FV23xsZW6yba9CKAfntNdaAf0ETJoP-0tfFcEGEfpVdpIsBv_rUCmjh9PADEY1UCgmsGQbnMm7L1wgT-LL9jqUhlwXB2894N8C0ubG7s-EB5ve9dbcQhXVN1xdoBnklMONSmk74NnRvrA7qqKk8jecZT26InIJI8QQyKcY7hd6PrpFKeukfYZSD3t5XG0sA";

  constructor(
      private utilities: UtilitiesService
    , private translateService: TranslateConfigService
    , private router: Router
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.enableWelcomeButton();
  }

  enableWelcomeButton() {
    // Enable Welcome Button
    this.welcomeButton = document.getElementById( 'welcomeButton' );

    console.log( 'welcomeButton: ', this.welcomeButton );

    if( this.welcomeButton )
      this.welcomeButton.disabled = false;
  }

  onEmail( email ) {
    this.email = email;
  }
  onName( name ) {
    this.name = name;
  }
  onSurname( surname ) {
    this.surname = surname;
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
    this.onUserInfo( this.setUserInfo( this.email, this.name, this.surname ));
  }
  restart() {
    this.creating = false;
    this.done = false;
  }

  onData( data: string ) {
    data =  JSON.parse( data );
    this.aliceKYC = data as AliceKYC;
    this.done = true;
    console.log( 'alice: ', this.aliceKYC);
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
        console.log( 'userToken: ', userToken );
        // this.aliceOnboardingWelcome( userInfo, userToken );
        this.aliceOnboarding( userToken );
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
          this.enableWelcomeButton();

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
        ( userInfo ) => { this.onSuccess( userInfo ); },
        ( err ) => { this.onError( err ); },
        () => { this.onCancel(  ); }
      );
  }

  setConfig( userToken?: string ) {
    const lang: string = ILangDEFAULTS.getCurrentLang( this.translateService ).lang;

    let documentStageConfig = new aliceonboarding.DocumentStageConfig(
      aliceonboarding.DocumentCapturerType.CAMERA, true, aliceonboarding.CameraType.BACK
    );

    const config = new aliceonboarding.OnboardingConfig()
      // Load Document By FILE EXPLORER || CAMERA
      .withAddDocumentStage( aliceonboarding.DocumentCapturerType.CAMERA )

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

  onSuccess( res ) {
    console.log("Onboarding complete. User info: " + JSON.stringify( res ));
    this.onData( JSON.stringify( res ));
  }

  onError( err ) {
    console.error("Onboarding error. Error: " + err.toString());
    this.done = false;
  }

  onCancel(  ) {
    console.log("Onboarding was canceled by the user");
    this.done = false;
  }

  home() {
    this.router.navigate(['menu/todas']);
  }
}
