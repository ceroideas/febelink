import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IKeywords} from '../models/search.model';
import {HttpService} from '../../../services/http.service';
import {ProfessionType} from '../../../pages/cuenta-profesional/cuenta-profesional.page';
import {Subject} from 'rxjs';

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

  locationFilter: string;
  metaLocationFilter: string;
  sectorFilter: string;

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

  setLocationFilter(location: string) {
    this.locationFilter = location;
  }

  setSectorFilter(sector: string) {
    this.sectorFilter = sector;
  }

  getSectorFilter() {
    return this.sectorFilter;
  }
  getLocationFilter() {
    return this.locationFilter;
  }

  setMetaLocationFilter(location: string) {
    this.metaLocationFilter = location;
  }

  getMetaLocationFilter() {
    return this.metaLocationFilter;
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

  async search(searchTerm: string = "", professions: number[]) {
    return this.http.post('product/search', {searchTerm, professions: JSON.stringify(professions)});
  }

  async searchMoreResults(searchTerm: string, searchIndex: number) {
    return this.http.post('product/search/more', {searchTerm, searchIndex});
  }

  async contact4Search(searchTerm: string, link: string, searchTitle: string, searchDescription: string, email?: string) {
    return this.http.post('product/search/contact', {searchTerm, link, searchTitle, searchDescription, email});
  }

  async getProductDetail(productId: number) {
    return this.http.get('product/detail/' + productId);
  }




  async registerClick(data: any) {

    const formData = new FormData();

    // Agregar datos al FormData si están presentes
    if (data.profile !== undefined) {
      formData.append('profile', data.profile);
    }
    if (data.publication !== undefined) {
      formData.append('publication', data.publication);
    }

    // Enviar la solicitud POST con el FormData
    return this.http.post('createClickWhatsApps', formData);
  }
}
