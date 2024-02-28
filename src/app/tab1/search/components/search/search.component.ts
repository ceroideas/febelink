import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {SearchService} from '../../services/search.service';
import {IKeywords} from '../../models/search.model';
import {SearchProductCardType} from '../product-card/product-card.component';
import {SearchCardType} from '../search-card/search-card.component';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';
import {SeoService} from 'src/app/services/seo.service';
import {Title} from '@angular/platform-browser';
import { Location } from '@angular/common';
import { KeywordService } from 'src/app/admin/keyword/services/keyword.service';

const GENERAL_TITLE = 'Feed Oráculo | Febelink ¿Qué necesitas?';

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
export class SearchComponent implements AfterViewInit {
  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  public data: any;
  @Input() type: string = '';
  @Output() generalTitle = new EventEmitter<string>();

  public slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  recommendations;
  searchResponse: SearchType;
  locationFilter: string = '';
  cityFilter: string = '';
  metaLocationFilter: string  = '';
  IdMetaFilter: string = '';
  resultTitle = 'Resultados';
  metaDescription = '';
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

  services = [];

  sectors = [ ];
  locations = [];
  locationLinks = [
  
  ];

  locationFilterLink: any[] = [];
  locationFilterLinkFull = [
   
  ];

  metaFilterLink = [
   
  ];
  cities= [];

  displayPartialSignUp: boolean = false;
  email: string;

  constructor(
    public searchService: SearchService,
    private router: Router,
    public authenticationService: AuthenticationService,
    private actRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private title: Title,
    private location: Location,
    private keywordService: KeywordService
  ) {

    this.leerDatos()


    /*this.actRouter.params.subscribe(val => {
      this.locationFilter = this.searchService.getLocationFilter();
      this.locationFilterLink = this.locationFilterLink.filter(link => link.locations_id.title === this.locationFilter);
      console.log(this.locationFilter, this.locationFilterLink);
    });*/

 
  }

  async leerDatos(){

    await this.readData()

    this.type = 'resultado';
    
    this.locationFilter = sessionStorage.getItem('locationFilter');
    this.cityFilter = sessionStorage.getItem('cityFilter');
    this.locationFilterLink = this.locationFilterLinkFull.filter(link => link.locations_id.title === this.locationFilter);
    this.metaLocationFilter = sessionStorage.getItem('metaLocationFilter');
    this.IdMetaFilter = sessionStorage.getItem('IdMetaFilter');
    

    this.actRouter.params.subscribe(val => {

      const metaLink = this.locationFilterLinkFull.find(item => item.locations_id.title === this.locationFilter 
        && item.id_sector.name === this.metaLocationFilter && Number(item.id) === Number(this.IdMetaFilter));
      const locationLink = this.locations.find(item => item.title === this.locationFilter);
      const sectorLink = this.sectors.find(item => item.title === this.locationFilter);
     

     
      console.log(metaLink)
      console.log(locationLink)
      console.log(sectorLink)
      if ( metaLink ) {
        this.resultTitle = metaLink.h2;
        this.metaDescription = metaLink.description;
        this.title.setTitle(metaLink.page_title);
        setTimeout(() => {
          this.generalTitle.emit(metaLink.h1);
        });

       this.readDataCityLocationSector(metaLink.locations_id.id, metaLink.id_sector.id)

      } else if ( locationLink ) {
        this.title.setTitle(locationLink.page_title);
        this.metaDescription = locationLink.meta_description;
        setTimeout(() => {
           this.generalTitle.emit(locationLink.h1);
        });

        this.readDataCity(locationLink.id)


        setTimeout(() => {
          const cityLink = this.cities.find(item => Number(item.citys_id) === Number(this.cityFilter));

          console.log( this.cities)
          console.log( cityLink)
       }, 2000);
       

      
      } else if ( sectorLink ) {

          this.title.setTitle(sectorLink.pageTitle);
        this.metaDescription = sectorLink.meta_description;

        setTimeout(() => {
          this.generalTitle.emit(sectorLink.h1);
        });
      } 
    });


    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {}


  
  async readData() {
    const seoData = sessionStorage.getItem('seoData');

    if ( !!seoData ) {
      const response = JSON.parse(seoData);
      this.services = response.sector
        .filter(item => !!item.icon)
        .sort((a, b) => 0.5 - Math.random());
      this.sectors = response.subsector
        .filter(item => !!item.imageURL)
        .sort((a, b) => 0.5 - Math.random());
      this.locations = response.locations;
      this.locationLinks = response.locations.sort((a,b) => a.title.localeCompare(b.title));
      this.locationFilterLinkFull = response.linklocations;

      this.fetchData();
    } else {
      await this.fetchData();
      this.services = this.services.sort((a, b) => 0.5 - Math.random());
      this.sectors = this.sectors.sort((a, b) => 0.5 - Math.random());
    }
  }


  async readDataCity(id) {
    const {response} = await this.keywordService.getLinkCitysLocation(id)
    this.cities = response;
  }

  async readDataCityLocationSector(id, sector) {
    const {response} = await this.keywordService.getLinkCitysLocationSector(id, sector)
    this.cities = response;
  }

  async fetchData() {
    const {response} = await this.keywordService.getData();
    this.services = response.sector
      .filter(item => !!item.icon)
      .sort((a, b) => 0.5 - Math.random());
    this.sectors = response.subsector
      .filter(item => !!item.imageURL)
      .sort((a, b) => 0.5 - Math.random());
    this.locations = response.locations;

    this.locationLinks = response.locations.sort((a,b) => a.title.localeCompare(b.title));
    this.locationFilterLinkFull = response.linklocations;

    sessionStorage.setItem('seoData', JSON.stringify(response));
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

  async search(searchTerm?: string, updateFilter: boolean = true) {
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
        sessionStorage.setItem('searchResponse',  JSON.stringify(response)  );

      }



    }


    const filterLink = this.locationFilterLinkFull.find(item => 
      item.link.replace(/ /g, '').replace(/-/g, '').toLowerCase() === this.searchText.replace(/ /g, '').replace(/-/g, '').toLowerCase()
    )
    const locationLink = this.locationLinks.find(item => 
      item.link.replace(/ /g, '').replace(/-/g, '').toLowerCase() === this.searchText.replace(/ /g, '').replace(/-/g, '').toLowerCase()
    )
    const citiesLink = this.cities.find(item => 
      item.link.replace(/ /g, '').replace(/-/g, '').toLowerCase() === this.searchText.replace(/ /g, '').replace(/-/g, '').toLowerCase()
    )
    const sectorLink = this.sectors.find(item => 
      item.link.replace(/ /g, '').replace(/-/g, '').toLowerCase() === this.searchText.replace(/ /g, '').replace(/-/g, '').toLowerCase()
    )


    console.log('filterlink', filterLink);
    console.log('locationlink', locationLink);
    console.log('citieslink', citiesLink);
    console.log('sectorlink', sectorLink)
   

    if ( filterLink ) {
      const metaLink = this.locationFilterLinkFull.find(item => item.locations_id.title === filterLink.locations_id.title 
        && item.id_sector.name === filterLink.id_sector.name && Number(item.id) === Number(this.IdMetaFilter));
     

      if ( metaLink ) {
        // Metalink available
        this.title.setTitle(metaLink.page_title);
        this.generalTitle.emit(metaLink.h1);
        this.resultTitle = metaLink.h2;
        this.metaDescription = metaLink.description;
        if ( updateFilter ) {
          this.locationFilterLink = this.locationFilterLinkFull.filter(l => l.locations_id.title === filterLink.locations_id.title);
          this.changeFilter(filterLink.location, filterLink.link);
          this.changeMetaFilter(metaLink.sector, metaLink.sector);
        }
      } else {
        // No metalink available
        this.title.setTitle(`${filterLink.title} en Febelink`);
        this.generalTitle.emit(`${filterLink.title} en ${filterLink.location}`);
        this.resultTitle = 'Resultados';
        this.metaDescription = '';
        if ( updateFilter ) {
            this.locationFilterLink = this.locationFilterLinkFull.filter(l => l.locations_id.title === filterLink.locations_id.title);
          this.changeFilter(filterLink.location, filterLink.link);
          this.changeMetaFilter(null, null);
        }
      }
     
      this.location.go(`listado/${filterLink.link}`)
    } else if (locationLink) {
      this.title.setTitle(locationLink.page_title);
      this.generalTitle.emit(locationLink.h1);
      this.resultTitle = '';
      this.metaDescription = locationLink.metaDescription;

      this.changeFilter(locationLink.title, locationLink.link)  ;
      this.changeMetaFilter(null, null);

      this.location.go(`listado/${locationLink.link}`)
    } else if (citiesLink) {
      this.title.setTitle(citiesLink.page_title);
      this.generalTitle.emit(citiesLink.h1);
      this.resultTitle = '';
      this.metaDescription = citiesLink.metaDescription;

      this.changeFilter(citiesLink.title, citiesLink.link)  ;
      this.changeMetaFilter(null, null);

      this.location.go(`listado/${citiesLink.link}`)
    } else if (sectorLink) {
      this.title.setTitle(sectorLink.page_title);
      this.generalTitle.emit(sectorLink.h1);
      this.resultTitle = '';
      this.metaDescription = sectorLink.metaDescription;

      this.changeFilter(sectorLink.title, sectorLink.link);
      this.changeMetaFilter(null, null);

      this.location.go(`listado/${sectorLink.link}`)
    } else {
      let searchText = this.searchText.replace(new RegExp(' ', 'g'), '-');
      // No link available
      this.title.setTitle(GENERAL_TITLE);
      this.generalTitle.emit('Encuentra servicios profesionales en tu ciudad');
      this.resultTitle = 'Resultados';


      if ( updateFilter ) {
        this.locationFilterLink = [];
        this.changeFilter(null, null);
        this.changeMetaFilter(null, null);
      }

      this.location.go(`listado/${searchText}`)
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

  removeBlankSpace(term: string): string {
    return term.replace(new RegExp(' ', 'g'), '-');
  }

  async changeFilter(locationFilter: string, link: string) {
    sessionStorage.removeItem("locationFilter");
    sessionStorage.removeItem("metaLocationFilter"); 
    sessionStorage.removeItem("IdMetaFilter"); 
   
    await this.searchService.setLocationFilter(locationFilter);
    sessionStorage.setItem('locationFilter', locationFilter);
    // this.irA('/listado/' + link);
  }

  async changeFilterImg(locationFilter: any) {
    sessionStorage.removeItem("locationFilter");
    sessionStorage.removeItem("metaLocationFilter"); 
    sessionStorage.removeItem("IdMetaFilter"); 
   
    await this.searchService.setLocationFilter(locationFilter.nombre);
    sessionStorage.setItem('locationFilter', locationFilter.nombre);
    this.generalTitle.emit(locationFilter.h1);
  }

  async changeMetaFilter(metaFilter: string, link: string , id?: string) {

    console.log(metaFilter)
    console.log(link)
    console.log(id)

    sessionStorage.removeItem("metaLocationFilter"); 
    sessionStorage.removeItem("IdMetaFilter"); 
    await this.searchService.setMetaLocationFilter(metaFilter);
    sessionStorage.setItem('metaLocationFilter', metaFilter);
    sessionStorage.setItem('IdMetaFilter', id);
    // this.irA('/listado/' + link);
  }

  async changeMetaFilterCity(metaFilter: string, link: string , location?: string, city?: string){
    sessionStorage.removeItem("cityFilter");
    sessionStorage.removeItem("metaLocationFilter"); 
    sessionStorage.removeItem("IdMetaFilter"); 
    await this.searchService.setMetaLocationFilter(metaFilter);
    sessionStorage.setItem('metaLocationFilter', metaFilter);
    sessionStorage.setItem('IdMetaFilter', location);
    sessionStorage.setItem("cityFilter", city);

  }

  changeTitles(titles : any){
    // sessionStorage.removeItem("locationFilter");
    // sessionStorage.removeItem("cityFilter");
    // sessionStorage.removeItem("metaLocationFilter"); 
    // sessionStorage.removeItem("IdMetaFilter"); 
    // this.title.setTitle(GENERAL_TITLE);
    //   this.generalTitle.emit('Encuentra servicios profesionales en tu ciudad');
    //   this.resultTitle = 'Resultados';
  }
  public trackItem(index: number, item: any) {
    return item.trackId;
  }
}
