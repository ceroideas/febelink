import { Component } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { GuidePage } from '../pages/guide/guide.page';
import { Router } from '@angular/router';
import { InteriorOfertaPage } from '../pages/interior-oferta/interior-oferta.page';
import { IOffer } from '../models/offer.model';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  currentYear = new Date().getFullYear();
  offers: IOffer[] = [];
  isLoading: boolean;
  currentUser: IUser = null;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router
  ) {}

  async ionViewDidEnter() {
    await this.getUserProfile();
    if (this.currentUser) {
      this.isLoading = true;
      await this.getOffers();
    }
  }

  async getUserProfile() {
    this.currentUser = await this.utilities.getUserData();
    console.log('getUserProfile', this.currentUser);
  }

  async getOffers() {
    const [ myOffers, offers ] = await Promise.all([
      await (await this.api.misOfertas()).toPromise(),
      await (await this.api.ofertasRecibidas()).toPromise()
    ]);
    console.log('myOffers', myOffers);
    console.log('offers', offers);
    this.offers = [...offers.flat(), ...myOffers];
    this.isLoading = false;
  }

  doRefreshOffers(refresher): void {
    this.getOffers();
    refresher.event.complete();
  }

  async deleteOffer(offer: IOffer) {
    (await this.api.borrarOferta(offer.id)).subscribe(
      (resp) => {
        console.log('OFERTA BORRADA correctamente', resp);
        this.getOffers();
      },
      (err) => {
        console.log(err);
        this.utilities.showToast('No se ha podido borrar la oferta');
      }
    );
  }

  async interiorOferta(oferta) {
    const interiorOfertaModal = await this.modalCtrl.create({
      component: InteriorOfertaPage,
      componentProps: { oferta: oferta },
    });

    await interiorOfertaModal.present();
    const { data } = await interiorOfertaModal.onWillDismiss();
    this.getOffers();
  }

  detalleDemanda(id_demanda, estado): void {
    let aceptada: boolean;
    if (estado == 1) aceptada = true;
    else aceptada = false;
    this.router.navigate(['demanda/' + id_demanda], {
      queryParams: { id_demanda: id_demanda, aceptada: aceptada },
    });
  }

  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }

  irA(p: string): void {
    if (p === '/menu/perfil') {
      if (this.currentUser) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/menu/perfil']);
      }
    } else {
      this.router.navigate([p]);
    }
  }
}
