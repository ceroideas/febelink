import {Component, OnInit} from '@angular/core';
import {
  ModalController,
  IonItemSliding,
  AlertController,
} from '@ionic/angular';
import {ApiService} from '../services/api.service';
import {UtilitiesService} from '../services/utilities.service';
import {Router} from '@angular/router';
import {InteriorOfertaPage} from '../pages/interior-oferta/interior-oferta.page';
import {IOffer} from '../models/offer.model';
import {IUser} from '../models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {TermsPage} from '../pages/terms/terms.page';
import {IFavorite} from '../models/favorite.model';
import {GuidePage} from '../pages/guide/guide.page';
import {NotificationService} from '../services/notification.service';
import {NotifType} from '../models/notification';
import {ISearch} from '../models/search.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  currentYear = new Date().getFullYear();
  offers: IOffer[] = [];
  isLoading: boolean;
  currentUser: IUser = null;
  unreadMessages: Map<number, number> = new Map();

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private notificationSvc: NotificationService
  ) {
  }


  async ngOnInit(): Promise<void> {
    await this.api.getUnreadMessages();
    this.api.unreadChatMessages.subscribe(unreadMessages => {
      this.unreadMessages.clear();
      unreadMessages?.forEach(room => {
        this.unreadMessages.set(+room.room_id, room.unread);
      });
      // console.log("unreadNotificationsCount", this.unreadMessages);
    });
  }

  async ionViewDidEnter() {
    await this.getUserProfile();
    if (this.currentUser) {
      this.isLoading = true;
      await this.getOffers();
    }
    // this.notificationSvc.setNotificationsAsRead(NotifType.Chat);
  }

  async getUserProfile() {
    this.currentUser = await this.utilities.getUserData();
  }

  async getOffers() {
    this.utilities.showLoading();
    const [myOffers, offers, favorites, mySearchs] = await Promise.all([
      this.setType(await (await this.api.misOfertas()).toPromise(), Type.MyOffer),
      this.setType(await (await this.api.ofertasRecibidas()).toPromise(), Type.ReceivedOffer),
      await (await this.api.getFavorites()).toPromise(),
      this.setType(await (await this.api.obtenerDemandasDemandante(this.currentUser.id)).toPromise(), Type.PendingDemand),
    ]);
    Object.values(favorites[0]).forEach((favorite: IOffer) => {
      favorite.type = Type.Favorite;
      favorite.created_at = favorites[1].find(
        (f: IFavorite) => f.favoriteable_id === favorite.id
      ).created_at;
    });

    let myOffersF = myOffers.sort((a, b) => {
      return b.id - a.id;
    });
    myOffersF = myOffersF.filter(
      (v, i, a) =>
        a.findIndex(
          (t) =>
            t.id_demanda === v.id_demanda && t.id_ofertante === v.id_ofertante
        ) === i
    );
    let receivedOffers = offers.sort((a, b) => {
      return b.id - a.id;
    });
    receivedOffers = receivedOffers.filter(
      (r) => r.id_ofertante !== this.currentUser.id
    );
    receivedOffers = receivedOffers.filter(
      (v, i, a) =>
        a.findIndex(
          (t) =>
            t.id_demanda === v.id_demanda && t.id_ofertante === v.id_ofertante
        ) === i
    );
    const finalOffers = [...receivedOffers.flat(), ...myOffersF].filter(
      (v, i, a) => a.findIndex((t) => t.id_demanda === v.id_demanda) === i
    );
    this.offers = [
      ...finalOffers,
      ...Object.values(favorites[0]),
      ...mySearchs,
    ];
    this.offers = this.offers.sort(
      (a: IOffer, b: IOffer) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    this.utilities.dismissLoading();
    this.isLoading = false;
  }

  doRefreshOffers(refresher): void {
    this.getOffers();
    refresher.event.complete();
  }

  async deleteOffer(offer: IOffer) {
    if (offer?.type === Type.Favorite) {
      (await this.api.unFavouriteDemand({id: offer.id})).subscribe(
        (result) => {
          this.utilities.showToast(
            this.translateService.instant('tabs.tab2.messageRemovedFavorite')
          );
          this.getOffers();
        },
        (err) => {
          this.utilities.showToast(
            this.translateService.instant('tabs.tab2.errorRemoveFavorite')
          );
        }
      );
    } else if (offer?.id_ofertante) {
      (await this.api.borrarOferta(offer.id)).subscribe(
        (resp) => {
          this.getOffers();
        },
        (err) => {
          console.log(err);
          this.utilities.showToast(
            this.translateService.instant('tabs.tab3.errorRemoveOffer')
          );
        }
      );
    } else {
      (await this.api.borrarDemanda(offer.id)).subscribe(
        (resp) => {
          this.getOffers();
        },
        (err) => {
          console.log(err);
          this.utilities.showToast(
            this.translateService.instant('tabs.tab3.errorRemoveSearch')
          );
        }
      );
    }
  }

  async interiorOferta(oferta) {
    const interiorOfertaModal = await this.modalCtrl.create({
      component: InteriorOfertaPage,
      componentProps: {oferta: oferta},
    });

    await interiorOfertaModal.present();
    const {data} = await interiorOfertaModal.onWillDismiss();
    this.getOffers();
  }

  detalleDemanda(idDemanda, estado): void {
    let aceptada: boolean;
    if (estado === 1) {
      aceptada = true;
    } else {
      aceptada = false;
    }
    this.router.navigate(['busqueda/' + idDemanda], {
      queryParams: {id_demanda: idDemanda, aceptada: aceptada},
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
      if (!this.currentUser) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/menu/perfil']);
      }
    } else {
      this.router.navigate([p]);
    }
  }

  getOfferBackgroundColor(offerStatus: number) {
    switch (offerStatus) {
      case 1: {
        return '#19cf50';
      }
      case 2: {
        return '#da1c1c';
      }
      case 3: {
        return '#3289db';
      }
    }
  }

  getOfferText(offerStatus: number) {
    switch (offerStatus) {
      case 1: {
        return 'Aceptada';
      }
      case 2: {
        return 'Denegada';
      }
      case 3: {
        return 'Sin respuesta';
      }
    }
  }

  async deleteItem(offer: IOffer) {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('menu.tabs.chat'),
      message: this.translateService.instant('tabs.tab3.alertDelete.message'),
      buttons: [
        {
          text: this.translateService.instant(
            'tabs.tab3.alertDelete.btnCancel'
          ),
          role: 'cancel',
        },
        {
          text: this.translateService.instant(
            'tabs.tab3.alertDelete.btnDelete'
          ),
          handler: () => {
            this.deleteOffer(offer);
          },
        },
      ],
    });
    await alert.present();
  }

  onClickSearchHandler(search: IOffer) {
    if (!search) {
      return;
    }
    // debugger
    switch (search.type) {
      case Type.Favorite:
        this.detalleDemanda(search?.id, 0);
        break;
      case Type.MyOffer:
        this.detalleDemanda(search?.id_demanda, search?.estado);
        break;
      case Type.PendingDemand:
        this.detalleDemanda(search['id'], search?.estado);
        break;
      case Type.ReceivedOffer:
        this.interiorOferta(search);
        break;
    }
  }

  /* async editItem(search: IOffer) {
     const editarModal = await this.modalCtrl.create({
       component: EditarDemandaPage,
       componentProps: { demanda: search },
     });

     await editarModal.present();

     const { data } = await editarModal.onWillDismiss();
   }*/

  getUnreadMessages(offer: any): number {
    if (!offer || !this.unreadMessages.size) {
      return;
    }
    let roomId: number;
    switch (offer.type) {
      case Type.ReceivedOffer: {
        roomId = +(offer.id_ofertante?.toString() + offer.id_demanda?.toString() + this.currentUser.id.toString());
        break;
      }
      case Type.MyOffer: {
        roomId = +(this.currentUser.id.toString() + offer.id_demanda?.toString() + offer.id_demandante?.toString());
        break;
      }
    }
    // debugger
    const num = this.unreadMessages.get(roomId);
    return num;
  }

  setType(item: any[], type: Type): any {
    item.map(item => {
      item.type = type;
      return item;
    });

    return item;
  }
}

enum Type {
  MyOffer = 1
  , ReceivedOffer = 2
  , Favorite = 3
  , PendingDemand = 4
}
