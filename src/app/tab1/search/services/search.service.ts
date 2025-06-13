import {Injectable} from '@angular/core';
import {IKeywords} from '../models/search.model';
import {HttpService} from '../../../services/http.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public visibleListas: boolean = true;
  public listaSearchDesktop: boolean = false;
  private dataLists = null;
  private iKeyWords: IKeywords | null = null;
  public isLoading: boolean = false;
  public show_imagen: boolean = true;
  public show_detalle: boolean = false;
  public dataDesktopDetail = null;

  locationFilter: string  | null = null
  metaLocationFilter: string | null = null
  sectorFilter: string | null = null

  constructor(
    private http: HttpService,
    private httpClient: HttpClient
  ) {
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
      //@ts-ignore
      return this.dataLists.data.results;
    }
  }

  getOffers() {
    if (this.dataLists != null) {
      //@ts-ignore

      return this.dataLists.data?.offers;
    }
  }

  getList() {
    if (this.dataLists != null) {
      //@ts-ignore

      return this.dataLists.data?.list;
    }
  }

  searchText(text?: string): string {
    if (text != undefined) {
      //@ts-ignore

      this.iKeyWords.searchText = text;
    }
      //@ts-ignore

    return this.iKeyWords?.searchText;
  }

  clear() {
    this.isLoading = false;
  }

  // Redesign

  async getProfessionsByFilter(filterTerm: string) {
    return this.http.post('collections/profession/filter', {filterTerm});
  }

  async doofinderSearch(searchTerm: string, transferCache: boolean = false) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${environment.DOOFINDER_API_KEY}`,
      }),
      transferCache: transferCache
    };

    return new Promise((resolve, reject) => {
      this.httpClient.get(`${environment.DOOFINDER_BASE_URL}${environment.DOOFINDER_HASHID}/_search?query=${searchTerm}&rpp=1000`, httpOptions)
      .subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      )
    })
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

  async findOffers(subsectors: number[], provinces: number[], cities: string[]) {
    return this.http.post('product/find', {
      subsectors: JSON.stringify(subsectors),
      provinces: JSON.stringify(provinces),
      cities: JSON.stringify(cities)
    });
  }

  async findOffersAiSection(subsectors: number[], provinces: number[], cities: string[]) {
    return this.http.post('findOffersAiSection', {
      subsectors: JSON.stringify(subsectors),
      provinces: JSON.stringify(provinces),
      cities: JSON.stringify(cities)
    });
  }
  async findOtherOffers(subsectors: number[], index: number = 0) {
    return this.http.post('product/findOthers', {
      subsectors: JSON.stringify(subsectors),
      index
    });
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

    if (data.user !== undefined) {
      formData.append('user', data.user);
    }

    // Enviar la solicitud POST con el FormData
    return this.http.post('createClickWhatsApps', formData);
  }
}
