import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertController, Platform, PopoverController } from '@ionic/angular';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { IUser } from 'src/app/models/user.model';
import { KYCAliceService } from 'src/app/services/kyc/kyc.alice.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {
  KYC_Country,
  KYC_DOCtype,
  KYC_ERR_Validation,
} from 'src/app/models/kyc.alice.model';
import {
  Onboarding,
  OnboardingConfig,
  DocumentType,
  CameraType,
  DocumentCapturerType,
  OnboardingWelcome,
  DocumentStageConfig,
} from 'aliceonboarding';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { environment } from 'src/environments/environment';

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

  lang: string;

  //SEARCH COMPONENT
  searchText: string = '';
  keyText: string = '';
  keys: any = [];
  openKeys: boolean = false;
  selectorEnabled: boolean = false;
  showCookies = false;
  refreshTab: any;

  isLoading: boolean = false;
  loadingMsg: string;

  countryLoadingClicked: boolean = false;
  nothingFound: boolean = false;
  subscription = null;
  hasSelected: boolean = false;
  cntrySelected: KYC_Country;
  docTypes = KYC_DOCtype;
  docTypeSelected: KYC_DOCtype;

  errorMsg: string;

  constructor(
    public popoverController: PopoverController,
    private translateService: TranslateConfigService,
    private utilities: UtilitiesService,
    private kycAliceService: KYCAliceService,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions,
    private platform: Platform
  ) {}

  async ngOnInit() {
    this.currentUser = { ...(await this.utilities.getUserData()) };
    this.isVerified();
  }

  async isVerified() {
    this.isLoading = true;
    this.loadingMsg = this.translateService.instant('kyc.verifying');

    if (!this.currentUser?.id) {
      this.dismiss({ isValidated: false });
      this.utilities.showAlert(
        this.translateService.instant('kyc.errors.user.title'),
        this.translateService.instant('kyc.errors.user.message')
      );
      return;
    }

    (
      await this.kycAliceService.verifyKYC(this.currentUser?.id, false)
    ).subscribe(
      (response) => {
        // If already verified, dismiss
        if (response?.hasVerified) {
          this.dismiss({ isValidated: true });
          if (response?.user) this.utilities.saveUserData(response?.user);
        }

        this.checkPlatform();
      },
      (err) => {
        this.checkPlatform();
      }
    );
  }

  retryTimes: number = 1;
  checkPlatform() {
    this.isLoading = false;
    this.platform.ready().then(() => {
      if (this.platform.is('android')) this.askAndroidPermissions();
      else if (this.platform.is('ios')) this.askIOSPermissions();
      else this.initialize();
    });
  }

  private hasSetAndroidListener: boolean = false;
  askAndroidPermissions() {
    // To never add more than 1 listener
    if (!this.hasSetAndroidListener) {
      this.hasSetAndroidListener = true;

      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          (result) => {
            if (!result.hasPermission) this.retryPermissions();
            else this.initialize();
          },
          (err) => this.retryPermissions()
        );
    }

    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    ]);
  }

  async askIOSPermissions() {
    let alert = await this.alertCtrl.create({
      header: this.translateService.instant('kyc.alert.ios.title'),
      message: this.translateService.instant('kyc.alert.ios.title'),
      backdropDismiss: false,
      buttons: [
        {
          text: 'INTENTAR',
          handler: () => this.initialize(),
        },
        {
          text: 'VOLVER',
          handler: () => {
            this.retryTimes = 0;
            this.retryPermissions();
          },
        },
      ],
    });

    await alert.present();
  }

  retryPermissions() {
    // Retry this number of times
    if (this.retryTimes > 0) {
      this.retryTimes--;
      this.checkPlatform();
    } else this.dismiss({ isValidated: false });
  }

  async initialize() {
    this.lang = (<ILang>(
      await ILangDEFAULTS.getCurrentLang(this.translateService)
    )).lang;
  }

  /**
   * SELECT COUNTRY TO BE ABLE TO SELECT DOC TYPE TO START KYC
   */
  addCountryFocus() {
    this.selectorEnabled = true;
  }

  async searchCountry() {
    if (this.hasSelected) {
      this.hasSelected = false;
      return;
    }

    this.nothingFound = false;
    this.keys = [];
    this.cntrySelected = null;

    if (this.searchText === '') this.selectorEnabled = true;

    // To remove listener of previous call
    if (this.subscription !== null) this.subscription.unsubscribe();

    if (this.searchText.length > 2 && this.selectorEnabled) {
      // To show on list the loading spinner
      this.keys.push({ name: 'Cargando...', value: 'loading' });

      this.subscription = (
        await this.kycAliceService.getCountriesByKey(this.searchText)
      ).subscribe(
        (response) => {
          this.kycAliceService.handleBackendToken(response);

          let keys = [];

          if (Object.keys(response.hierarchy).length > 0) {
            for (const key in response.hierarchy) {
              const country = response.hierarchy[key];
              let item: KYC_Country = {
                name: this.highlight(country.name),
                value: country.name,
                countryISO: key,
                docTypes: country.document_types,
              };

              keys.push(item);
            }
          } else this.nothingFound = true;

          this.countryLoadingClicked = false;
          this.keys = keys;
        },
        (err) => {
          this.onError(err);
        }
      );
    }
  }

  highlight(query) {
    if (!this.searchText) {
      return query;
    }

    return query
      .toString()
      .replace(new RegExp(this.searchText, 'gi'), (match) => {
        return '<strong>' + match + '</strong>';
      });
  }

  removeCountryFocus() {
    // ToDo: analyze if should delete this method, it is annoying
    return;

    setTimeout(() => {
      // To prevent cancel country search when Loading Countries Clicked
      if (this.countryLoadingClicked) {
        this.countryLoadingClicked = false;
        return;
      }

      this.keyText = this.searchText;
      this.selectorEnabled = false;
      this.keys.length = 0;

      // To remove listener of previous call
      if (this.subscription !== null) this.subscription.unsubscribe();
    }, 500);
  }

  clearBtn() {
    this.keys = [];
    this.cntrySelected = null;
  }

  detectKeyPressed(event) {
    this.keys.length = 0;
  }

  async countrySelected(country: KYC_Country) {
    // Prevent click on Loading spinner
    if (country.value == 'loading') {
      this.countryLoadingClicked = true;

      this.addCountryFocus();
      return;
    }

    this.keys = [];

    this.hasSelected = true;
    this.searchText = country.value;
    this.keyText = this.searchText;
    this.selectorEnabled = true;
    this.cntrySelected = country;
  }

  docSelected(docType: KYC_DOCtype) {
    this.getUserToken(docType);
  }

  restart() {
    this.creating = false;
    this.done = false;
    this.isLoading = false;
    this.errorMsg = null;
  }

  async getUserToken(docType: KYC_DOCtype) {
    this.isLoading = true;
    this.creating = true;

    if (this.userToken)
      setTimeout(() => {
        // To give it time to draw the alice-onboarding html
        this.isLoading = false;
        this.aliceOnboarding(this.userToken, docType);
      }, 500);
    else
      (
        await this.kycAliceService.authenticateUser(this.currentUser.id, false)
      ).subscribe(
        (response) => {
          this.isLoading = false;

          // If already verified, dismiss
          if (response?.hasVerified) this.dismiss({ isValidated: true });

          this.userToken = response?.user_token;

          if (!this.userToken) {
            alert('No pude validar el usuario, por favor reintenta nuevamente');
            this.restart();
          } else this.aliceOnboarding(this.userToken, docType);
        },
        (err) => {
          this.onError(err);
        }
      );
  }

  // Out of maintenance, do not use Alice's welcome for now (until enabled)
  aliceOnboardingWelcome(userInfo, userToken, docType: KYC_DOCtype) {
    new OnboardingWelcome('alice-onboarding-mount', userInfo).run(
      (res) => {
        this.aliceOnboarding(userToken, docType);
      },
      () => {
        this.onCancel();
      }
    );
  }

  aliceOnboarding(userToken, docType: KYC_DOCtype) {
    const config = this.setConfig(userToken, docType);

    new Onboarding('alice-onboarding-mount', config).run(
      (userInfo) => {
        this.onFinished();
      },
      (err) => {
        this.onError(err);
      },
      () => {
        this.onCancel();
      }
    );
  }

  setConfig(userToken: string, docType: KYC_DOCtype) {
    this.docTypeSelected = docType;

    const config = new OnboardingConfig()

      // Language
      .withCustomLocalization(this.lang);

    let documentType: DocumentType;
    // Type of Documents
    switch (docType) {
      case KYC_DOCtype.ID:
        documentType = DocumentType.IDCARD;
        break;
      case KYC_DOCtype.PASSPORT:
        documentType = DocumentType.PASSPORT;
        break;
      case KYC_DOCtype.RESIDENCE:
        documentType = DocumentType.RESIDENCEPERMIT;
        break;
      case KYC_DOCtype.DRIVER:
        documentType = DocumentType.DRIVERLICENSE;
        break;
    }

    // Load Document By FILE EXPLORER || CAMERA
    let documentStageConfig = new DocumentStageConfig(
      DocumentCapturerType.ALL,
      true,
      CameraType.BACK
    );
    config.withAddDocumentStage(
      documentType,
      this.cntrySelected?.countryISO,
      documentStageConfig
    );

    // Requieres Selfie validation
    if (environment.KYC_SELFIE) config.withAddSelfieStage();

    // This token identifies each user ( Will create a new one unless already exists )
    config.withUserToken(userToken);

    return config;
  }

  async onFinished() {
    this.isLoading = true;
    this.loadingMsg = this.translateService.instant('kyc.loading');

    (
      await this.kycAliceService.checkLifeProof(
        this.currentUser.id,
        this.docTypeSelected,
        false
      )
    ).subscribe(
      (response: KYC_ERR_Validation) => {
        if (!this.isValid(response)) this.errOnLifeProof(response);
        else this.dismiss({ ...response, isValidated: true });

        this.isLoading = false;
      },
      (err) => {
        this.onError(err);
      }
    );
  }

  isValid(response: KYC_ERR_Validation) {
    const isDocOK = response?.document?.isValid;
    const isSelfieOK = !environment.KYC_SELFIE || response?.selfie?.isValid;

    return isDocOK && isSelfieOK;
  }

  errOnLifeProof(response: KYC_ERR_Validation) {
    let msg =
      '<h4>' + this.translateService.instant('kyc.errors.title') + '</h4>';

    /** Error With Document */
    if (!response.document)
      msg +=
        '<br><br>' + this.translateService.instant('kyc.errors.document.none');
    else if (!response.document.isValid) {
      if (!response.document.backHasFields)
        msg +=
          '<br>' +
          this.translateService.instant('kyc.errors.document.backFields');

      if (!response.document.frontHasFields)
        msg +=
          '<br>' +
          this.translateService.instant('kyc.errors.document.frontFields');

      if (!response.document.allFieldsOK) {
        msg +=
          '<br><br>' +
          this.translateService.instant('kyc.errors.document.err') +
          '<br><ul>';

        if (!response.document.nameOK)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.name') +
            '</li>';
        if (!response.document.surnameOK)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.surname') +
            '</li>';
        if (!response.document.birthOK)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.birthdate') +
            '</li>';
        /* if( !response.document.isOver18 )
          msg += '<li>' + this.translateService.instant( 'kyc.errors.document.legal_age' ) + '</li>'; */
        if (response.document.dateExpired)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.expire') +
            '</li>';
        if (!response.document.docNumberOK)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.number') +
            '</li>';

        if (!response.document.consistentDoc)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.consistent') +
            '</li>';
        if (!response.document.expectedDoc)
          msg +=
            '<li>' +
            this.translateService.instant('kyc.errors.document.expected') +
            '</li>';

        msg += '</ul>';
      }
    }

    /** Error With Selfie */
    if (environment.KYC_SELFIE && !response.selfie)
      msg +=
        '<br><br>' + this.translateService.instant('kyc.errors.selfie.none');
    else if (environment.KYC_SELFIE && !response.selfie.isValid) {
      msg +=
        '<br><br>' +
        this.translateService.instant('kyc.errors.selfie.err') +
        '<br><ul>';
      if (!response.selfie.isRealPerson)
        msg +=
          '<li>' +
          this.translateService.instant('kyc.errors.selfie.is_real') +
          '</li>';
      if (!response.selfie.hasFaceMatching)
        msg +=
          '<li>' +
          this.translateService.instant('kyc.errors.selfie.face_match') +
          '</li>';

      msg += '</ul>';
    }

    this.errorMsg = msg;
  }

  onError(err) {
    console.error('Onboarding error. Error: ', err);
    this.done = false;

    this.retryAlert(
      this.translateService.instant('kyc.errors.alice.title'),
      this.translateService.instant('kyc.errors.alice.message')
    );
  }

  onCancel() {
    // console.log("Onboarding was canceled by the user");
    this.done = false;

    this.dismiss({ isValidated: false });
  }

  async retryAlert(title, msg) {
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
          },
        },
        {
          text: 'VOLVER',
          handler: () => {
            if (this.onCancellation) this.onCancellation;

            this.dismiss({ isValidated: false });
          },
        },
      ],
    });

    await alert.present();
  }

  dismiss(result) {
    if (result?.user) this.utilities.saveUserData(result?.user);
    this.popoverController.dismiss({ result });
  }
}
