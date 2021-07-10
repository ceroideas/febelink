import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class DemandaService {

  constructor(
    private api: ApiService,
    private utilities: UtilitiesService,
    private translateService: TranslateService
  ) { }

  async addToFavorites(demand):Promise<void> {
    let p = {
      id: demand.id,
    };
    // Add to favorites.
    if (demand.favorito) {
      this.utilities.showLoading();
      (await this.api.favouriteDemand(p)).subscribe(result => {
        this.utilities.dismissLoading();
        this.utilities.showToast(this.translateService.instant("tabs.tab2.messageAddedFavorite"));

      },err => {
        this.utilities.dismissLoading();
        this.utilities.showToast(this.translateService.instant("tabs.tab2.errorAddFavorite"));
      });
    }
    // Remove from favorites.
    else {
      this.utilities.showLoading();
      (await this.api.unFavouriteDemand(p)).subscribe(result => {
        this.utilities.dismissLoading();
        this.utilities.showToast(this.translateService.instant("tabs.tab2.messageRemovedFavorite"));
      },err => {
        this.utilities.dismissLoading();
        this.utilities.showToast(this.translateService.instant("tabs.tab2.errorRemoveFavorite"));
      });
    }
  }
}
