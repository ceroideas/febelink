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
import { SesionCtrlPage } from '../sesion-ctrl/sesion-ctrl.page';
import { GuidePage } from '../guide/guide.page';
import { Meta } from '@angular/platform-browser';
import {AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-detalle-demanda',
  templateUrl: './detalle-demanda.page.html',
  styleUrls: ['./detalle-demanda.page.scss'],
})
export class DetalleDemandaPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  demanda: any;
  opiniones: any;
  demandasRelacionadas: any;
  rol: any;
  aceptada: boolean;
  sector_correcto: boolean;
  subSector_correcto: boolean;
  sectoresPerfil: any[] = [];
  subSectoresPerfil: any[] = [];
  perfil: any;
  isLoading: boolean;
  showChat = false;

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
    private navCtrl: NavController
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
              'https://api.febelink.com/storage/' + demanda.imagen;
        }
        this.demanda = demanda;
        this.obtenerOfertasRelacionadas();
      },
      (err) => {
        this.isLoading = false;
        this.utilities.showToast('ERROR ' + JSON.stringify(err));
      }
    );
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
        console.log('this.demandasRelacionadas', this.demandasRelacionadas);
        for (let demanda of this.demandasRelacionadas) {
          if (demanda.imagen != null) {
            if (
              !demanda.imagen.includes('http://') &&
              !demanda.imagen.includes('https://')
            )
              demanda.imagen =
                'https://api.febelink.com/storage/' + demanda.imagen;
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
    this.router.navigate(['perfil-demandante/' + this.demanda.id_demandante], {
      queryParams: {
        id_perfil: this.demanda.id_demandante,
        contacto: this.aceptada,
      },
    });
  }

  async userRegister() {
    const registerModal = await this.modalCtrl.create({
      component: SesionCtrlPage,
    });

    await registerModal.present();
  }

  public share(id, ev: any): void {
    if (this.platform.is('cordova')) {
      this.shareNative(id);
    } else {
      this.shareWeb(ev);
    }
  }

  /**
   * Share Android/iOS
   */
  shareNative(id) {
    let url = 'https://febelink.com/demanda/' + id;
    var desc = this.demanda.descripcion;

    if (desc.length > 50) {
      desc = desc.substring(0, 49) + '...';
    }

    let message = 'Febelink \n' + this.demanda.nombre + ': \n' + desc + ' \n';

    this.socialSharing
      .share(null, null, null, url)
      .then((result) => {})
      .catch((error) => {});
  }

  /**
   * Share Web
   */
  async shareWeb(ev: any) {
    let url = 'https://febelink.com/demanda/' + this.demanda.id;
    var desc = this.demanda.descripcion;

    if (desc.length > 50) {
      desc = desc.substring(0, 49) + '...';
    }

    let message = 'Febelink \n' + this.demanda.nombre + ': \n' + desc + ' \n';

    const popover = await this.popoverController.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url: url, title: message, desc: desc },
    });
    return await popover.present();
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

  viewChat() {
    this.storage.get('userData').then(res => {
      if (res) {
        const roomId = `${res.id}${this.demanda.id}${this.demanda.id_demandante}`;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              user_id: JSON.stringify(res.id),
              person_name: JSON.stringify('Chat'),
              person_id: JSON.stringify(res.id),
              room_id: JSON.stringify(roomId),
              create: JSON.stringify(res.id),
              id_demandante: JSON.stringify(this.demanda.id_demandante)
            }
          };
          this.navCtrl.navigateForward('chat', navigationExtras);
      }
    });

  }
}
