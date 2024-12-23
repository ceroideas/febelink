import {ChangeDetectorRef, Component} from '@angular/core';
import { SearchProductCardType } from '../../search/product-card/product-card.component';
import { SearchService } from '../../tab1/search/services/search.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ModalService } from '../../services/modal.service';
import { FavoriteService } from '../../services/favorite.service';

export interface SearchType {
  services: SearchProductCardType[];
  offers: SearchProductCardType[];
  users: any; // ToDo: Add type here,
  otherResults: any[];
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {

  offers: any[] = [];

  unitTypes = [
    {id: 1, name: 'Día', shorthand: 'día', lang: 'ES'},
    {id: 2, name: 'Mes', shorthand: 'mes', lang: 'ES'},
    {id: 3, name: 'Año', shorthand: 'año', lang: 'ES'},
    {id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES'},
    {id: 5, name: 'Hora', shorthand: 'hora', lang: 'ES'},
    {id: 6, name: 'Consulta', shorthand: 'consulta', lang: 'ES'},
    {id: 7, name: 'Sesión', shorthand: 'sesión', lang: 'ES'},
    {id: 8, name: 'Jornada', shorthand: 'jornada', lang: 'ES'},
    {id: 9, name: 'Oferta', shorthand: 'oferta', lang: 'ES'},
    {id: 10, name: 'Campaña', shorthand: 'campaña', lang: 'ES'},
    {id: 11, name: 'Porcentaje', shorthand: '%', lang: 'ES'},
    {id: 12, name: 'Donación', shorthand: 'donación', lang: 'ES'},
    {id: 13, name: 'Presupuesto', shorthand: 'presupuesto', lang: 'ES'},
  ]; // ToDo: Get this from the priceType Collection

  loading: boolean = false;

  constructor(
    public searchService: SearchService,
    public authenticationService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private modalService: ModalService,
    private favoriteService: FavoriteService,
  ) {
    this.findOffers();
  }

  findOffers() {
    this.loading = true;

    this.favoriteService.getFavorites()
    .then((data) => {
      if ( data && data.response && data.response ) {
        this.offers = data.response;
      } else {
        this.offers = [];
      }

      this.loading = false;
      this.cdRef.detectChanges
    })
    .catch((error: any) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });
  }

  askForBudget() {
    this.modalService.openAskForBudgetModal();
  }
}
