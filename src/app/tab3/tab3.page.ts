import {Component} from '@angular/core';
import {ModalController, IonItemSliding,NavController} from '@ionic/angular';
import {ApiService} from '../services/api.service';
import {UtilitiesService} from '../services/utilities.service';
import {GuidePage} from '../pages/guide/guide.page';
import {SuscribirsePage} from '../pages/suscribirse/suscribirse.page';
import {NavigationExtras, Router} from '@angular/router';
import {InteriorOfertaPage} from '../pages/interior-oferta/interior-oferta.page';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
    settingsOfertas: string = 'ofertasPage'; // default button
    ofertas: any;
    misOfertas: any;
    misOfertas_one: any;
    isLoading: boolean;
    perfil: any;

    constructor(
        private modalCtrl: ModalController,
        private api: ApiService,
        private storage: Storage,
        private navCtrl: NavController,
        private utilities: UtilitiesService,
        private router: Router
    ) {
        this.settingsOfertas = 'ofertasPage';
    }

    /**
     * Obtenemos las ofertas cada vez que entramos en la pantalla
     */
    public async ionViewDidEnter() {
        this.misOfertas = [];
        this.ofertas = [];

        await this.obtenerPerfil();

        if (this.perfil !== null) {
            this.isLoading = true;
            await this.obtenerOfertas();
            await this.obtenerMisOfertas();
        }
    }

    /**
     * Obtener las ofertas del ofertante del servidor
     */
    async obtenerMisOfertas() {

        (await this.api.misOfertas()).subscribe((ofertas) => {

            this.misOfertas_one = ofertas;
            // console.log(ofertas)
            this.isLoading = false;
            this.obtenerChatOfertas();
        });


    }

    async obtenerChatOfertas() {
        let ofertas_chat=[];

        this.misOfertas_one.forEach(element => {

            this.api.getChatOferta(element.id_demanda, element.id_ofertante).then(myObservable => {
                myObservable.subscribe((response) => {
                    if (response.result >0) {
                       element.chat=response.result;
                       ofertas_chat.push(element)
                    } else {
                      element.chat=0;
                      ofertas_chat.push(element)
                    }
                });
            });
        });
      this.misOfertas=ofertas_chat;
    };

  viewChat(id_demanda,id_demandante) {

    this.storage.get('userData').then(res => {
      if (res) {

        let room_id = res.id+""+id_demanda+""+id_demandante;
        let navigationExtras: NavigationExtras = {
          queryParams: {
            user_id: JSON.stringify(res.id),
            person_name: JSON.stringify('Chat'),
            person_id: JSON.stringify(id_demandante),
            room_id: JSON.stringify(room_id),
            create: JSON.stringify(id_demandante),
          }
        };

        this.navCtrl.navigateForward('chat', navigationExtras);
      }
    });

  }

    /**
     * Modal para suscribirse
     */
    async suscribirse() {
        const suscribirseModal = await this.modalCtrl.create({
            component: SuscribirsePage,
        });

        await suscribirseModal.present();
        const {data} = await suscribirseModal.onWillDismiss();
        this.obtenerMisOfertas();
    }

    /**
     * Recargar las ofertas del ofertante
     * @param refresher
     */
    public doRefreshMisOfertas(refresher): void {
        this.obtenerMisOfertas();
        refresher.event.complete();
    }

    /**
     * Borramos la oferta con un itemSliding
     * @param oferta
     * @param item
     */
    async borrarOferta(oferta, item: IonItemSliding) {

        (await this.api.borrarOferta(oferta.id)).subscribe(
            (resp) => {
                console.log('OFERTA BORRADA correctamente', resp);
                this.obtenerMisOfertas();
                item.close();
            },
            (err) => {
                console.log(err);
                this.utilities.showToast('No se ha podido borrar la oferta');
            }
        );
    }

    /**
     * Ir a la demanda con su estado
     * @param id_demanda
     * @param estado
     */
    public detalleDemanda(id_demanda, estado): void {
        let aceptada: boolean;
        if (estado == 1) aceptada = true;
        else aceptada = false;
        this.router.navigate(['demanda/' + id_demanda], {
            queryParams: {id_demanda: id_demanda, aceptada: aceptada},
        });
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
     * Obtener las ofertas del servidor y terminar de cargar
     */
    async obtenerOfertas() {
        (await this.api.ofertasRecibidas()).subscribe((res) => {

            let ofertas = [];
            for (var i = 0; i < res.length; i++) {
                let element = res[i];
                Array.isArray(element)
                    ? ofertas.push(element[0])
                    : ofertas.push(element);
            }
            this.ofertas = ofertas;

            this.isLoading = false;
        });
    }

    /**
     * Método para recargar las ofertas
     * @param refresher
     */
    public doRefreshOfertas(refresher): void {
        this.obtenerOfertas();
        refresher.complete();
    }

    /**
     * Creamos modal para el interior de la oferta
     * @param oferta
     */
    async interiorOferta(oferta) {
        const interiorOfertaModal = await this.modalCtrl.create({
            component: InteriorOfertaPage,
            componentProps: {oferta: oferta},
        });

        await interiorOfertaModal.present();
        const {data} = await interiorOfertaModal.onWillDismiss();
        this.obtenerOfertas();
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
}
