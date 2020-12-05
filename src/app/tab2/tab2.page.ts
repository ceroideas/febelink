import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { EditarDemandaPage } from '../pages/editar-demanda/editar-demanda.page';
import { PublicarDemandaPage } from '../pages/publicar-demanda/publicar-demanda.page';
import { GuidePage } from '../pages/guide/guide.page';
import { TermsPage } from '../pages/terms/terms.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  settingsDemandas: string = 'demandasPage'; // default button
  perfil: any;
  demandas: any;
  misDemandas: any;
  isLoading: boolean;

  constructor(
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    this.settingsDemandas = 'demandasPage';
  }

  ngOnInit() {}

  /**
   * Modal para abrir terminos y condiciones
   */
  async termsModal() {
    const TermsModal = await this.modalCtrl.create({
      component: TermsPage,
    });

    await TermsModal.present();
  }

  async ionViewDidEnter() {
    this.demandas = [];
    this.misDemandas = [];

    await this.obtenerPerfil();

    if (this.perfil !== null) {
      this.isLoading = true;
      this.obtenerDemandas();
      this.obtenerDemandasDemandante();
    }
  }

  async obtenerDemandas() {
    this.demandas = [];
    (await this.api.demandasRecibidas()).subscribe((demandas) => {
      demandas = demandas.filter(
        (demanda) => demanda.id_demandante !== this.perfil.id
      );
      for (let demanda of demandas) {
        if (demanda.imagen != null) {
          if (
            !demanda.imagen.includes('http://') &&
            !demanda.imagen.includes('https://')
          ) {
            demanda.imagen =
              'https://api.febelink.com/storage/' + demanda.imagen;
          }
        }
        this.demandas.push(demanda);
      }

      this.isLoading = false;
    });
  }

  async obtenerDemandasDemandante() {
    this.misDemandas = [];
    this.isLoading = true;

    (await this.api.obtenerDemandasDemandante(this.perfil.id)).subscribe(
      (misDemandas) => {
        for (let demanda of misDemandas) {
          if (demanda.imagen != null) {
            if (
              !demanda.imagen.includes('http://') &&
              !demanda.imagen.includes('https://')
            ) {
              demanda.imagen =
                'https://api.febelink.com/storage/' + demanda.imagen;
            }
          }
          this.misDemandas.push(demanda);
        }
        this.isLoading = false;
      }
    );
  }

  /**
   * Obtener datos del perfil
   */
  async obtenerPerfil() {
    await this.utilities.getUserData().then((data) => {
      this.perfil = data;
    });
  }

  /**
   * Cuando se refresca se obtienen las demandas
   * @param refresherDem
   */
  public doRefreshDemandas(refresherDem): void {
    this.obtenerDemandas();
    refresherDem.target.complete();
  }

  /**
   * Cuando se refresca se obtienen las demandas
   * @param refresherMisDem
   */
  public doRefreshMisDemandas(refresherMis): void {
    this.obtenerDemandasDemandante();
    refresherMis.target.complete();
  }

  /**
   * Ir a la pantalla de la demanda
   * @param demanda
   */
  public detalleDemanda(demanda): void {
    this.router.navigate(['demanda/' + demanda.id], {
      queryParams: { demanda: JSON.stringify(demanda) },
    });
  }

  /**
   * Mostar modal para editar la demanda
   * @param demanda
   */
  async editarDemanda(demanda) {
    const editarModal = await this.modalCtrl.create({
      component: EditarDemandaPage,
      componentProps: { demanda: demanda },
    });

    await editarModal.present();

    const { data } = await editarModal.onWillDismiss();
    this.obtenerDemandasDemandante();
  }

  /**
   * Método para borrar la demanda
   * @param demanda
   */
  async borrarDemanda(demanda) {
    let alert = await this.alertCtrl.create({
      header: demanda.nombre,
      subHeader: 'Seguro que quieres borrar la demanda?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {},
        },
        {
          text: 'Aceptar',
          handler: async () => {
            (await this.api.borrarDemanda(demanda.id)).subscribe((resp) => {
              this.obtenerDemandasDemandante();
              this.utilities.showToast(
                'Se ha borrado correctamente la demanda'
              );
            });
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Crear modal para publicar demanda
   */
  async publicarDemanda() {
    const publicarModal = await this.modalCtrl.create({
      component: PublicarDemandaPage,
    });

    await publicarModal.present();

    const { data } = await publicarModal.onWillDismiss();

    if (this.perfil !== null) {
      this.obtenerDemandasDemandante();
    }
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

  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }

  home() {
    this.router.navigate(['menu/todas']);
  }
}
