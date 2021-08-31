import { Component, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ModalController, Platform } from '@ionic/angular';
import { GuidePage } from '../pages/guide/guide.page';
import { UtilitiesService } from '../services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookiesComponent } from '../components/cookies/cookies.component';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { answerOptions } from 'src/utils/utils';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ISector, ISubSector } from '../models/sector.model';
import { IUser } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { TermsPage } from '../pages/terms/terms.page';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  currentYear = new Date().getFullYear();
  perfil: IUser = null;
  isLoading: boolean;
  sectors: ISector[] = [];
  subSectors: ISubSector[] = [];
  sector: any;
  isLogin: any;
  cookies: string;
  filter_hidden: boolean;

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
  answerOptions = answerOptions();
  srcFoto: any;
  base64img: any;
  isNative: boolean = true;
  showCard = false;

  constructor(
    private api: ApiService,
    public platform: Platform,
    private utilities: UtilitiesService,
    private router: Router,
    private modalCtrl: ModalController,
    private elementRef: ElementRef,
    private cookSvc: CookieService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private authSvc:AuthenticationService,
    private userSvc:UserService,
    private activatedRoute:ActivatedRoute
  ) {
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
      this.obtenerPerfil();
    });

    this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
    this.builtForm();
    if(this.platform.is('cordova')){
      this.isNative = true;

    } else {
      this.isNative = false;
    }
  }

  ionViewDidEnter() {
    this.loadData();
    this.recomendation();
  }

  ionViewDidLeave() {
    this.showCard = false;
    this.searchText = '';
    this.sectors = [];
    this.subSectors = [];
    this.publishSearchForm.reset();
  }

  builtForm() {
    this.publishSearchForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      sector: ['', Validators.required],
      ofertas_restantes: [answerOptions()[answerOptions().length - 1].value],
      sub_sector: ['']
    });
  }

  async submitForm() {
    if( this.perfil !== null) {
      const { nombre, descripcion: texto, sector, sub_sector, ofertas_restantes } = this.publishSearchForm.value;


      if( this.userSvc.checkUserDataComplete(this.perfil)){
        this.utilities.showLoading();
          (await this.api.publicarDemanda(nombre, texto, sector, sub_sector, ofertas_restantes, this.base64img)).subscribe(async resp => {
            if( sector !== -1 ) {
              (await this.api.enviarNotificacionAOfertantes(this.translateService.instant("tabs.tab1.messageSearchDone"),
              `${this.translateService.instant("common.labelTitle")}:  ${nombre} \n${this.translateService.instant("common.labelDescription")}: ${texto}`,
              sector, sub_sector)).subscribe( resp => {
                console.log("Notificacion enviada correctamente")
              });
            }
            this.utilities.dismissLoading();
            this.utilities.showToast(this.translateService.instant("tabs.tab1.messageSearchSent"));
          },err => {
            this.utilities.dismissLoading();
            this.utilities.showToast(this.translateService.instant("tabs.tab1.errorPublishSearch"));
          });
      }
    } else {
      this.authSvc.userNeedsToRegister();
    }
  }

  checkUserFields(): boolean {
    return this.perfil?.dni !== null && this.perfil?.telefono !== null && this.perfil?.direccion !== null;
  }

  async loadData() {
    await this.obtenerPerfil();
    this.loadSectors();
    this.loadSubSectors(0);
  }

  async obtenerPerfil() {
    this.cookies = this.cookSvc.get('wizard');
    if (this.cookies === 'wizard') {
      this.showCookies = false;
    } else {
      if (!this.platform.is('cordova') && this.cookies !== 'wizard') {
        //this.openGuide();
      }
      this.cookSvc.set('wizard', 'wizard');
      this.showCookies = true;
    }

    await this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });

    await this.utilities.getUserData().then((data) => {
      this.perfil = data;

      if (this.perfil !== null) {
        if (this.perfil.skip_wizard === 0 && this.isLogin === 'login') {
          //if(this.platform.is('cordova')){
          //this.openGuide();
          //}
          this.utilities.setGuia('other');
        }
      }
    });
  }

  async loadSectors() {
    this.sectors.push({
      id: 0,
      nombre: 'Todas',
    });
    this.sectors = [
      ...this.sectors,
      ...await (await this.api.obtenerSectores()).toPromise()
    ];
    this.publishSearchForm.patchValue({sector: this.sectors[0].id});
  }

  async loadSubSectors(id: number) {
    this.subSectors.push(
      {
        id: 0,
        nombre: 'Todas',
        id_sector: 0
      }
    );

    this.subSectors = [
      ...this.subSectors,
      ...await (await this.api.obtenerSubSectores(id)).toPromise()
    ];

    this.publishSearchForm.patchValue({sub_sector: this.subSectors[0].id});
  }

  onChangeSector(event) {
    this.subSectors = [];
    this.loadSubSectors(event.detail.value);
  }

  //NEW SEARCH COMPONENT
  addFocus() {
    this.selectorEnabled = true;
  }

  detectKeyPressed(event) {
    if ((event.key === 'Enter') && (this.searchText.length > 2)) {
      this.showCard = true;
      setTimeout(() => {
        this.keys.length = 0;
      }, 500);
    }
  }

  async search() {
    console.log('SEARCH', this.searchText, this.selectorEnabled);
    if (this.searchText === '') {
      this.keys = [];
      this.selectorEnabled = true;
    }
    this.publishSearchForm.patchValue({nombre: this.searchText});
    if ((this.searchText.length > 2) && (this.selectorEnabled)) {
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
    }
  }

  async getSectorsByKeys(key) {
    console.log('getSectorsByKeys');
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
    });
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

  async openCookies() {
    const cookiesModal = await this.modalCtrl.create({
      component: CookiesComponent,
    });
    await cookiesModal.present();
  }

  closeCookies() {
    this.showCookies = false;
  }

  attachImage():void {
    if(this.platform.is('cordova')){
      this.attachImageNative();
    } else {
      this.attachImageWeb();
    }
  }

  attachImageNative():void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1920,
      targetHeight: 1080,
      allowEdit: false
    }
    this.camera.getPicture(options).then((urlFoto) => {
      this.srcFoto = this.sanitizer.bypassSecurityTrustUrl(urlFoto);
      this.base64img = 'data:image/jpeg;base64,' + urlFoto;
    }).catch(error => {
      this.utilities.showAlert('Error al obtener imagen', error);
    })
  }

  attachImageWeb(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let filePicker = this.elementRef.nativeElement.querySelector('.input-file-demandas');
      if (!filePicker || !filePicker.files
          || filePicker.files.length <= 0) {
          reject('No file selected.');
          return;
      }
      const myFile = filePicker.files[0];
      if (myFile.size > 307200) {
        this.utilities.showToast('Imagen demasiado grande, max. 300KB');
        return;
    }
    this.base64img = await this.convert(myFile);
      this.srcFoto = true;

      resolve();
  });
  }

  convert(myFile: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
        const fileReader = new FileReader();
        if (fileReader && myFile) {
            fileReader.readAsDataURL(myFile);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        } else {
            reject('No file provided');
        }
    });
  }

  /**
   * Modal para abrir terminos y condiciones
   */
  async termsModal() {
    const TermsModal = await this.modalCtrl.create({
      component: TermsPage,
    });

    await TermsModal.present();
  }

  private recomendation() {
    const recommenderId: string = this.activatedRoute.snapshot.paramMap.get('recommenderId');
    if(recommenderId){
      console.log('Recomended by', recommenderId); 
      this.cookSvc.set('recommenderId', recommenderId, 1);
    }
  }

}