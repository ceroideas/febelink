import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, PopoverController, Platform, AlertController } from '@ionic/angular';
import { PublicarOpinionPage } from '../publicar-opinion/publicar-opinion.page';
import { SesionCtrlPage } from '../sesion-ctrl/sesion-ctrl.page';
import { GuidePage } from '../guide/guide.page';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { IUser } from 'src/app/models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil-demandante',
  templateUrl: './perfil-demandante.page.html',
  styleUrls: ['./perfil-demandante.page.scss'],
})
export class PerfilDemandantePage implements OnInit {
  id_perfil: any;
  opiniones: any;
  perfil: any;
  perfilpublico: any;
  contacto: any;
  sinOpiniones: any;
  isLoading: boolean;
  refreshTab:any;
  isLogin: any;
  currentUser: IUser = null;
  urlName:string;


  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    private utilities: UtilitiesService,
    private translateService: TranslateService
  ) {
    var data: any = route.snapshot.queryParamMap;
    // this.id_perfil = data.params.id_perfil;
    this.contacto = data.params.contacto;

    this.route.paramMap.subscribe((params) => {
      this.id_perfil = params.get('id');
      this.urlName = params.get('name');
    });
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
      this.getUserProfile();
    });
  }

  async getUserProfile() {
    await this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
    await this.utilities.getUserData().then((data) => {
      this.currentUser = {...data};
      if (this.currentUser) {
        if (this.currentUser.skip_wizard === 0 && this.isLogin === 'login') {
          //if(this.platform.is('cordova')){
          //this.openGuide();
          //}
          this.utilities.setGuia('other');
        }
      }
    });
  }

  ngOnInit() {
    this.obtenerPerfil();
    this.getUserProfile();
  }

  /**
   * Obtenemos el perfil del servidor
   */
  async obtenerPerfil() {
    this.isLoading = true;
    (await this.api.obtenerPerfil(this.id_perfil)).subscribe(
      (res) => {
        this.perfilpublico = res.user;
        this.id_perfil = this.perfilpublico.reference; //referencia del demandante
        if (this.perfilpublico.logo != null) {
          if (
            !this.perfilpublico.logo.includes('http://') &&
            !this.perfilpublico.logo.includes('https://')
          )
            this.perfilpublico.logo =
            `${environment.baseWebUrl}storage/${this.perfilpublico.logo}`;
        } else {
          this.perfilpublico.logo = '';
        }

        this.perfilpublico.valoracion = res.opinions;
        this.isLoading = false;
        this.opinionesPerfil();
        this.comprobarOpinion();
        this.isCorrectSearch() 
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  async isCorrectSearch(){
    if(this.urlName){
      const nameToUrlType:string = this.utilities.textToUrl(this.perfilpublico.name);
      if(nameToUrlType !== this.urlName){
        const alert = await this.alertController.create({
            header: this.translateService.instant('pages.perfilDemandante.alertNameDontMatch.header'),
            message: this.translateService.instant('pages.perfilDemandante.alertNameDontMatch.message'),
            buttons: ['Aceptar']
        });
        alert.present();
      }
    }
  }

  /**
   * Obtenemos las opiniones del perfil del servidor
   */
  async opinionesPerfil() {
    (await this.api.opinionesPerfil(this.id_perfil)).subscribe((data) => {
      this.opiniones = data;
    });
  }
  /**
   * Comprobar si el perfil tiene opiniones realizadas
   */
  async comprobarOpinion() {
    (await this.api.comprobarOpinion(this.id_perfil)).subscribe(
      (sinOpiniones) => {
        this.sinOpiniones = sinOpiniones.sin_opiniones;
      }
    );
  }

  public async shareProfile(ev: any): Promise<void> {

    let subject =
    'Mira el perfil de ' + this.perfilpublico.name + ' usuario de Febelink:';
    const nameForUrl = this.utilities.textToUrl(this.perfilpublico.name);
    let url = `https://febelink.com/perfil/${this.id_perfil}/${nameForUrl}`;//
    let message = 'Febelink \n' + subject + ' \n';

    let image = null;
    if(await this.isImage(this.perfilpublico.logo)){
      image = this.perfilpublico.logo;
    } 

    if (this.platform.is('cordova')) {
      this.shareProfileNative(url, message, image);
    } else {
      this.shareProfileWeb(ev, url, message, image);
    }
  }

  /**
   * Share Native ( Android/iOS)
   */
  public shareProfileNative(url:string, message:string, image?:string) {
    this.socialSharing.share(message, message, image, url);
  }

  /**
   * Share Web
   */
  async shareProfileWeb(ev: any, url:string, message:string, image?:string) {

    const popover = await this.popoverController.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url, title: 'Febelink', desc: message, image  },
    });
    return await popover.present();
  }

  /*
  * Check if image exist
  */
  isImage(src):Promise<boolean> {
    return new Promise(resolve => {
      var image = new Image();
      image.onerror = function() {
          resolve(false);
      };
      image.onload = function() {
          resolve(true);
      };
      image.src = src;
    });
  }


  /**
   * Modal para valorar el perfil
   */
  async opinionModal() {
    console.log(this.currentUser.id);
    if (this.currentUser.id != undefined) {
      const publicarModal = await this.modalCtrl.create({
        component: PublicarOpinionPage,
        componentProps: { id_demandante: this.perfilpublico.id },
      });

      await publicarModal.present();

      const { data } = await publicarModal.onWillDismiss();
      this.opinionesPerfil();
      this.comprobarOpinion();
      this.obtenerPerfil();
    } else {
      this.userRegister();
    }
  }

  /**
   * Crear modal para registro de usuario
   */
  async userRegister() {
    const registerModal = await this.modalCtrl.create({
      component: SesionCtrlPage,
    });

    await registerModal.present();
  }

  home() {
    this.router.navigate(['menu/todas']);
  }

  public irA(p: string): void {
    if (p === '/menu/perfil') {
      if (this.perfil === undefined) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/menu/perfil']);
      }
    } else {
      this.router.navigate([p]);
    }
  }

  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }
}
