import { Component } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { GuidePage } from '../pages/guide/guide.page';
import { Router } from '@angular/router';
import { InteriorOfertaPage } from '../pages/interior-oferta/interior-oferta.page';
import { IOffer } from '../models/offer.model';
import { IUser } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { TermsPage } from '../pages/terms/terms.page';

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
    private router: Router,
    private translateService: TranslateService
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
  }

  async getOffers() {
    const [ myOffers, offers, favorites ] = await Promise.all([
      await (await this.api.misOfertas()).toPromise(),
      await (await this.api.ofertasRecibidas()).toPromise(),
      await (await this.api.getFavorites()).toPromise()
    ]);
    Object.values(favorites).forEach((favorite: IOffer) => favorite.type = "favorite")
    this.offers = [...offers.flat(), ...myOffers, ...Object.values(favorites)];
    this.isLoading = false;
  }

  doRefreshOffers(refresher): void {
    this.getOffers();
    refresher.event.complete();
  }

  async deleteOffer(offer: IOffer) {
    if (offer?.type === 'favorite') {
      (await this.api.unFavouriteDemand({id: offer.id})).subscribe(result => {
        this.utilities.showToast(this.translateService.instant("tabs.tab2.messageRemovedFavorite"));
        this.getOffers();
      },err => {
        this.utilities.showToast(this.translateService.instant("tabs.tab2.errorRemoveFavorite"));
      });
    }
    else {
      (await this.api.borrarOferta(offer.id)).subscribe(
        (resp) => {
          this.getOffers();
        },
        (err) => {
          console.log(err);
          this.utilities.showToast('No se ha podido borrar la oferta');
        }
      );
    }
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

  getOfferBackgroundColor(offerStatus: number) {
    switch(offerStatus) {
      case 1: {
        return "#19cf50";
      }
      case 2: {
        return "#da1c1c";
      }
      case 3: {
        return "#3289db";
      }
    }
  }

  getOfferText(offerStatus: number) {
    switch(offerStatus) {
      case 1: {
        return "Aceptada";
      }
      case 2: {
        return "Denegada";
      }
      case 3: {
        return "Sin respuesta";
      }
    }
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
}