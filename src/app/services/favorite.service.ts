import {Injectable} from '@angular/core';
import { HttpService, IHttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private http: HttpService
  ) {
  }

  async toggleFavorite(id: number): Promise<IHttpService> {
    return this.http.post(`favoriteProducts`, { id });
  }

  async getFavorites(): Promise<IHttpService> {
    return this.http.get('getFavoriteProduct');
  }

  async isFavorite(id: number): Promise<IHttpService> {
    return this.http.get(`getIsFavoriteProduct/${id}`);
  }
}
