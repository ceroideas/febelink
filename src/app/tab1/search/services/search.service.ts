import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IKeywords} from '../models/search.model';
import {HttpService} from '../../../services/http.service';
import {ProfessionType} from '../../../pages/cuenta-profesional/cuenta-profesional.page';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public visibleListas: boolean = true;
  public listaSearchDesktop: boolean = false;
  private dataLists = null;
  private iKeyWords: IKeywords;
  public isLoading: boolean = false;
  public show_imagen: boolean = true;
  public show_detalle: boolean = false;
  public dataDesktopDetail = null;

  constructor(private http: HttpService) {
  }


  async getDataListas() {
    /*return new Promise((resolve, reject) => {
      this.http.get('assets/search_data_listas.json')
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log('Error al obtener los datos: ' + error);
          reject(error);
        });
    });*/
  }

  set(searchText: string) {
    this.searchText(searchText);
  }

  getData() {
    /*return new Promise((resolve, reject) => {
      this.http.get('assets/search_data_recom.json')
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log('Error al obtener los datos recomendados: ' + error);
          reject(error);
        });
    });*/

  }

  async getDetalle(id: number) {
    /* return new Promise((resolve, reject) => {
       this.http.get('assets/search_detalle.json')
         .subscribe(data => {
           resolve(data);
         }, error => {
           console.log('Error al obtener los datos recomendados: ' + error);
           reject(error);
         });
     });*/
  }

  getResult() {
    if (this.dataLists != null) {
      return this.dataLists.data.results;
    }
  }

  getOffers() {
    if (this.dataLists != null) {
      return this.dataLists.data.offers;
    }
  }

  getList() {
    if (this.dataLists != null) {
      return this.dataLists.data.list;
    }
  }

  searchText(text?: string): string {
    if (text != undefined) {
      this.iKeyWords.searchText = text;
    }
    return this.iKeyWords?.searchText;
  }

  clear() {
    this.isLoading = false;
  }

  // Redesign

  async getProfessionsByFilter(filterTerm: string) {
    return this.http.post('collections/profession/filter', {filterTerm});
  }

  async getRecommendations() {
    return this.http.get('product/recommendations');
  }

  async search(profession: ProfessionType) {
    return this.http.post('product/search', {searchTerm: profession.id});
  }

  async getProductDetail(productId: number) {
    return this.http.get('product/detail/' + productId);
  }

  async addProductToActiveCart(productId, productAmount) {
    return this.http.post('cart/add', {productId, productAmount});
  }
}
