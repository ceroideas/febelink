import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IKeywords} from '../models/search.model';

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

  constructor(private http: HttpClient) {
  }

  search(text) {
    if (text != '') {
      this.visibleListas = false;
      this.listaSearchDesktop = true;
      /*this.getDataListas()
      .then(res => {
        this.dataLists = res;
      }).catch(err => {
          console.log(err);
      });*/
    } else {
      this.visibleListas = true;
      this.listaSearchDesktop = false;
    }
  }

  async getDataListas() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/search_data_listas.json')
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log('Error al obtener los datos: ' + error);
          reject(error);
        });
    });
  }

  set(searchText: string) {
    this.searchText(searchText);
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/search_data_recom.json')
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log('Error al obtener los datos recomendados: ' + error);
          reject(error);
        });
    });

  }

  async getDetalle(id: number) {
    return new Promise((resolve, reject) => {
      this.http.get('assets/search_detalle.json')
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log('Error al obtener los datos recomendados: ' + error);
          reject(error);
        });
    });
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
}
