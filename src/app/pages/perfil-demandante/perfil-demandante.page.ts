import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, PopoverController, Platform } from '@ionic/angular';
import { PublicarOpinionPage } from '../publicar-opinion/publicar-opinion.page';
import { SesionCtrlPage } from '../sesion-ctrl/sesion-ctrl.page';
import { GuidePage } from '../guide/guide.page';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';

@Component({
  selector: 'app-perfil-demandante',
  templateUrl: './perfil-demandante.page.html',
  styleUrls: ['./perfil-demandante.page.scss'],
})
export class PerfilDemandantePage implements OnInit {

  id_perfil: any;
  opiniones: any;
  perfil: any;
  contacto: any;
  sinOpiniones: any;
  isLoading: boolean;

  constructor( private route: ActivatedRoute,
               private api: ApiService,
               private socialSharing: SocialSharing,
               private platform: Platform,
               private modalCtrl: ModalController,
               public popoverController: PopoverController,
               private router: Router ) { 

    var data:any = route.snapshot.queryParamMap;
   // this.id_perfil = data.params.id_perfil;
    this.contacto = data.params.contacto;

    this.route.paramMap.subscribe(params => {
      this.id_perfil = params.get('id');
    });

  }

  ngOnInit() {

    this.obtenerPerfil();

  }

  /**
   * Obtenemos el perfil del servidor
   */
  async obtenerPerfil() {

    this.isLoading = true;
    (await this.api.obtenerPerfil(this.id_perfil)).subscribe( res => {

      this.perfil = res.user;
      this.id_perfil = this.perfil.reference;//referencia del demandante
      if (this.perfil.logo != null) {
        if (!this.perfil.logo.includes("http://") && !this.perfil.logo.includes("https://"))
        this.perfil.logo = "https://api.febelink.com/storage/" + this.perfil.logo;
      }else {
        this.perfil.logo = "";
      }
  
      this.perfil.valoracion = res.opinions;
      this.isLoading = false;
      this.opinionesPerfil();
      this.comprobarOpinion();

    },err => {
      this.isLoading = false;
    });
    
  }

  /**
   * Obtenemos las opiniones del perfil del servidor
   */
  async opinionesPerfil() {
    (await this.api.opinionesPerfil(this.id_perfil)).subscribe(data => {
      this.opiniones = data;
    });
  }
   /**
   * Comprobar si el perfil tiene opiniones realizadas
   */
  async comprobarOpinion() {

    (await this.api.comprobarOpinion(this.id_perfil)).subscribe(sinOpiniones => {
      this.sinOpiniones = sinOpiniones.sin_opiniones;
    });
  }

  public shareProfile( ev: any ):void {

    if(this.platform.is('cordova')){

     this.shareProfileNative();

    } else { 

      this.shareProfileWeb(ev);
     
    }
  }

  /**
   * Share Native ( Android/iOS)
   */
  public shareProfileNative() {
   
    let subject = "Mira el perfil de " + this.perfil.name + " usuario de Febelink:";
    let url = "https://febelink.com/perfil-demandante/"+this.id_perfil;
    let message = "Febelink \n"+subject+" \n";

    this.socialSharing.share(null, null, null, url);

  }

  /**
   * Share Web
   */
  async shareProfileWeb(ev: any) {

    let subject = "Mira el perfil de " + this.perfil.name + " usuario de Febelink:";
    let url = "https://febelink.com/perfil-demandante/"+this.id_perfil;
    let message = "Febelink \n"+subject+" \n";

    const popover = await this.popoverController.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url:url, title: 'Febelink', desc: message  }
    });
    return await popover.present();
  }

   /**
   * Modal para valorar el perfil
   */
  async opinionModal() {

    if(this.perfil !== null){

      const publicarModal = await this.modalCtrl.create({
        component: PublicarOpinionPage,
        componentProps: { id_demandante: this.perfil.id }
      });
  
      await publicarModal.present();
  
      const { data } = await publicarModal.onWillDismiss();
      this.opinionesPerfil();
      this.comprobarOpinion();
      this.obtenerPerfil();

    }else {

      this.userRegister();

    }
    
  }

  /**
   * Crear modal para registro de usuario
   */
  async userRegister() {

    const registerModal = await this.modalCtrl.create({
      component: SesionCtrlPage
    });

    await registerModal.present();
  }

  home() {
    this.router.navigate(['tabs/tab1']);
  }

  public irA(p: string): void {

    if(p === '/tabs/tab4') {
      if(this.perfil === null){
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/tabs/tab4']);
      }
    } else {
      this.router.navigate([p]);
    }
    
  }

  async openGuide() {

    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal'
    });
    return await guideModal.present();

  }

}
