import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {SearchService} from '../../services/search.service';
import {IKeywords} from '../../models/search.model';
import {SearchProductCardType} from '../product-card/product-card.component';
import {SearchCardType} from '../search-card/search-card.component';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';
import {SeoService} from 'src/app/services/seo.service';

export interface SearchType {
  services: SearchProductCardType[];
  offers: SearchProductCardType[];
  users: any; // ToDo: Add type here,
  otherResults: SearchCardType[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  public data: any;
  @Input() type: string = '';

  public slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  recommendations;
  searchResponse: SearchType;
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
  ]; // ToDo: Get this from the priceType Collection

  services = [
    {name: 'Asesores', icon: 'assets/imgs/home/services-assistant.svg', searchTerm: 'asesores'},
    {name: 'Deportes', icon: 'assets/imgs/home/services-sport.svg', searchTerm: 'deportes'},
    {name: 'Belleza y estética', icon: 'assets/imgs/home/services-beauty.svg', searchTerm: 'belleza y estética'},
    {name: 'Formación', icon: 'assets/imgs/home/services-learning.svg', searchTerm: 'formación'},
    {name: 'Reformas', icon: 'assets/imgs/home/services-reforms.svg', searchTerm: 'reformas'},
    {name: 'Ocio', icon: 'assets/imgs/home/services-entertainment.svg', searchTerm: 'ocio y fiestas'},
    {name: 'Diseño y programación', icon: 'assets/imgs/home/services-development.svg', searchTerm: 'diseño y programacion'},
    {name: 'Salud', icon: 'assets/imgs/home/services-health.svg', searchTerm: 'salud'},
    {name: 'Abogados', icon: 'assets/imgs/home/services-lawyer.svg', searchTerm: 'abogados'},
    {name: 'Talleres', icon: 'assets/imgs/home/services-car.svg', searchTerm: 'taller mecanico'},
  ];

  sectors = [
    {title: 'Asesores fiscales', link: 'asesores fiscales en', imageURL: 'assets/imgs/home/sector-assistant.jpeg'},
    {title: 'Fontaneros', link: 'fontanero en', imageURL: 'assets/imgs/home/sector-plumber.jpeg'},
    {title: 'Profesor particular', link: 'profesor particular en', imageURL: 'assets/imgs/home/sector-learning.jpeg'},
    {title: 'Fisioterapeutas', link: 'fisioterapeuta en', imageURL: 'assets/imgs/home/sector-health.jpeg'},
    {title: 'Podólogos', link: 'podólogos en', imageURL: 'assets/imgs/home/sector-health.jpeg'},
    {title: 'Mecánicos', link: 'taller mecánico en', imageURL: 'assets/imgs/home/sector-car.jpeg'},
    {title: 'Desarrolladores', link: 'empresa de programacion y desarrollo en', imageURL: 'assets/imgs/home/sector-technology.jpeg'},
    {title: 'Diseñador gráfico', link: 'empresa de diseño grafico en', imageURL: 'assets/imgs/home/sector-technology.jpeg'},
    {title: 'Pintores', link: 'empresa de pintores en', imageURL: 'assets/imgs/home/sector-plumber.jpeg'},
    {title: 'Cuidadores', link: 'empresa de cuidadores en', imageURL: 'assets/imgs/home/sector-care.jpeg'},
  ];

  constructor(
    public searchService: SearchService,
    private router: Router,
    public authenticationService: AuthenticationService,
  ) {
    this.type = 'resultado';
    this.services = this.services.sort((a, b) => 0.5 - Math.random());
    this.sectors = this.sectors.sort((a, b) => 0.5 - Math.random());
  }

  ngOnInit() {
    this.getRecommendations();
    /*this.searchService.getData()
    .then(res => {
        this.data = res;
    }).catch(err => {
        console.log(err);
    }); */
  }

  segmentChanged(event) {
    console.log(event);
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  getR() {
    return this.searchService.getResult();
  }

  getOf() {
    return this.searchService.getOffers();
  }

  getL() {
    return this.searchService.getList();
  }

  text(text?: string): string {
    if (text != undefined) {
      this.searchText = text;
    }
    return this.searchText || '';
  }

  clear() {
    this.searchText = '';
  }

  async getRecommendations() {
    const {response} = await this.searchService.getRecommendations();
    if (response) {
      this.recommendations = response;

      // ToDo: Temporal SHUFFLE results
      let shuffledResults = this.recommendations?.specialOffer;
      var m = shuffledResults.length,
        t,
        i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = shuffledResults[m];
        shuffledResults[m] = shuffledResults[i];
        shuffledResults[i] = t;
      }

      this.recommendations.specialOffer = shuffledResults;
    }
  }

  async search() {
    const {response} = await this.searchService.getProfessionsByFilter(
      this.searchText
    );
    if (response) {
      const bestProfessionMatch: number[] = [];
      response.forEach((elem) => {
        bestProfessionMatch.push(elem.id);
      });
      if (bestProfessionMatch.length > 0 || this.searchText) {
        const {response} = await this.searchService.search(
          this.searchText,
          bestProfessionMatch
        );
        this.searchResponse = response;
      }
    }
  }

  async searchMoreResults() {
    let otherResultAmount = this.searchResponse?.otherResults?.length;

    if (otherResultAmount < 100 && this.searchText) {
      const {response} = await this.searchService.searchMoreResults(
        this.searchText,
        otherResultAmount + 1
      );
      this.searchResponse.otherResults =
        this.searchResponse.otherResults.concat(response);
    }
  }
}
