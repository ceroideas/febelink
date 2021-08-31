import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ApiService } from 'src/app/services/api.service';
import {
  ModalController,
  NavParams,
  PopoverController,
  IonContent,
  Platform,
  NavController,
} from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';
import { GuidePage } from '../guide/guide.page';
import { Meta } from '@angular/platform-browser';
import {AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IUser } from 'src/app/models/user.model';
import { ISearch } from 'src/app/models/search.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DemandaService } from 'src/app/services/demanda.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detalle-demanda',
  templateUrl: './detalle-demanda.page.html',
  styleUrls: ['./detalle-demanda.page.scss'],
})
export class DetalleDemandaPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  demanda: ISearch = null;
  opiniones: any;
  demandasRelacionadas: any;
  rol: any;
  aceptada: boolean;
  sector_correcto: boolean;
  subSector_correcto: boolean;
  sectoresPerfil: any[] = [];
  subSectoresPerfil: any[] = [];
  perfil: IUser = null;
  isLoading: boolean;
  showChat = false;
  urlName:string;

  constructor(
    private utilities: UtilitiesService,
    private platform: Platform,
    private api: ApiService,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public meta: Meta,
    private socialSharing: SocialSharing,
    public popoverController: PopoverController,
    public alertController: AlertController,
    private storage: Storage,
    private navCtrl: NavController,
    private translateService: TranslateService,
    private authSvc:AuthenticationService,
    private demanadaSvc:DemandaService,
    private userSvc:UserService
  ) {
    let data: any = route.snapshot.queryParamMap;
    let id_demanda = data.params.id_demanda;

    //if (id_demanda) {
    if (data.params.demanda === undefined) {
      //this.obtenerDemanda(id_demanda);
      //this.aceptada = data.params.aceptada;

      this.route.paramMap.subscribe((params) => {
        this.obtenerDemanda(params.get('id'));
        this.aceptada = data.params.aceptada;
        this.urlName = params.get('name');
        
      });
    } else {
      this.aceptada = false;
      this.demanda = JSON.parse(data.params.demanda);
      this.obtenerOfertasRelacionadas();
    }
  }

  ngOnInit() {
    this.obtenerPerfil();
  }

  /**
   * Obtenemos la demanda a partir del id
   * @param id_demanda
   */
  async obtenerDemanda(id_demanda) {
    this.isLoading = true;
    (await this.api.obtenerDemanda(id_demanda)).subscribe(
      (demanda) => {
        if (demanda.imagen != null) {
          if (
            !demanda.imagen.includes('http://') &&
            !demanda.imagen.includes('https://')
          )
            demanda.imagen =
            `${environment.baseWebUrl}storage/${demanda.imagen}`;
        }
        this.demanda = demanda;
        this.obtenerOfertasRelacionadas();

        this.isCorrectSearch() 
      },
      (err) => {
        this.isLoading = false;
        this.utilities.showToast('ERROR ' + JSON.stringify(err));
      }
    );
  }

  async isCorrectSearch(){
    if(this.urlName){
      const nameToUrlType:string = this.utilities.textToUrl(this.demanda.nombre);
      if(nameToUrlType !== this.urlName){
        const alert = await this.alertController.create({
            header: this.translateService.instant('pages.demandDetails.alertNameDontMatch.header'),
            message: this.translateService.instant('pages.demandDetails.alertNameDontMatch.message'),
            buttons: ['Aceptar']
        });
        alert.present();
      }
    }
  }

  async obtenerOfertasRelacionadas() {
    this.isLoading = true;
    (
      await this.api.obtenerDemandasRelacionadas(
        this.demanda.id_demandante,
        this.demanda.id
      )
    ).subscribe(
      (resp) => {
        this.demandasRelacionadas = resp;
        // console.log('this.demandasRelacionadas', this.demandasRelacionadas);
        for (let demanda of this.demandasRelacionadas) {
          if (demanda.imagen != null) {
            if (
              !demanda.imagen.includes('http://') &&
              !demanda.imagen.includes('https://')
            )
              demanda.imagen =
                `${environment.baseWebUrl}storage/${demanda.imagen}`;
          }
          demanda.valoracion = Number(demanda.valoracion);
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  /**
   * Ir a otra demanda
   * @param demanda
   */
  public detalleDemanda(demanda): void {
    this.demanda = demanda;
    this.obtenerOfertasRelacionadas();
    this.content.scrollToTop(1500);
    //this.router.navigate(['detalle-demanda'],{ queryParams: { 'demanda': JSON.stringify(demanda), 'contacto': false  }});
  }

  /**
   * Ir a un perfil
   */
  public irAPerfil(): void {
    this.router.navigate(['perfil/' + this.demanda.id_demandante], {
      queryParams: {
        id_perfil: this.demanda.id_demandante,
        contacto: this.aceptada,
      },
    });
  }

  public async share(id, ev: any): Promise<void> {
    const nameForUrl = this.utilities.textToUrl(this.demanda.nombre);
    let url = `${environment.WEB_URL}busqueda/${id}/${nameForUrl}`;
    var desc = this.demanda.descripcion;

    if (desc.length > 50) {
      desc = desc.substring(0, 49) + '...';
    }
    let message = '¿Conoces una solución para esta búsqueda?\n' + this.demanda.nombre + ': \n' + desc + ' \n-Febelink-\n';

    let image = null;
    if(await this.isImage(this.demanda.imagen)){
      image = this.demanda.imagen;
    } 

    if (this.platform.is('cordova')) {
      this.shareNative(url, message, image);
    } else {
      this.shareWeb(ev, url, message, image);
    }
  }

  /**
   * Share Android/iOS
   */
  shareNative(url:string, message:string, image?:string) {

    this.socialSharing
      .share(message, message, image, url)
      .then((result) => {})
      .catch((error) => {});
  }

  /**
   * Share Web
   */
  async shareWeb(ev: any, url:string, message:string, image?:string) {

    const popover = await this.popoverController.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url, title: message, desc:message, image },
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
   * Navegar a la pantalla p
   * @param p
   */
  public irA(p: string): void {
    if (p === '/menu/perfil') {
      if (this.perfil === null) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/menu/perfil']);
      }
    } else {
      this.router.navigate([p]);
    }
  }

  async obtenerPerfil() {
    this.perfil = await this.utilities.getUserData();
  }

  home() {
    this.router.navigate(['menu/todas']);
  }

  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }

  goToChat() {

    if(this.userSvc.checkUserDataComplete(this.perfil)){
      this.storage.get('userData').then(user => {
        if (user) {
          const roomId = `${user.id}${this.demanda.id}${this.demanda.id_demandante}`;
            const navigationExtras: NavigationExtras = {
              queryParams: {
                user_id: JSON.stringify(user.id),
                user_name: JSON.stringify(user.name),
                person_name: JSON.stringify('Chat'),
                person_id: JSON.stringify(this.demanda.id_demandante),
                room_id: JSON.stringify(roomId),
                create: JSON.stringify(user.id),
                id_demandante: JSON.stringify(this.demanda.id_demandante),
                demand_id: JSON.stringify(this.demanda.id),
                search_title: JSON.stringify(this.demanda.nombre),
              }
            };
            this.navCtrl.navigateForward('chat', navigationExtras);
        }
      });
    }
  }

  async viewChat() {
    if (this.perfil !== null) {
        if (this.perfil.id == this.demanda.id_demandante) {
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Chat',
                message: this.translateService.instant('pages.demandDetails.alertChat.message'),
                buttons: ['Aceptar']
            });

            await alert.present();
        } else {
            this.goToChat();
        }
    } else {
      this.authSvc.userNeedsToRegister();
    }
  }

  async onClickAddToFavorites(demand) {
    this.demanadaSvc.addToFavorites(demand);
  }
}
