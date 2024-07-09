import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { KeywordService } from '../admin/keyword/services/keyword.service';
import { SearchCardType } from './search-card/search-card.component';
import { SearchProductCardType } from './product-card/product-card.component';
import { SearchService } from '../tab1/search/services/search.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { SeoService } from '../services/seo.service';
import { Keywords } from '../interfaces/keywords';
import { LinkLocation } from '../interfaces/link-location';
import { Location } from '../interfaces/location';
import { Sector } from '../interfaces/sector';
import { Subsector } from '../interfaces/subsector';
import { IHttpService } from '../services/http.service';
import slugify from "slugify";
import { City } from '../interfaces/city';
import { LinkCity } from '../interfaces/link-city';
const GENERAL_TITLE = 'Febelink ¿Qué necesitas? Ofertas de servicios profesionales';
const GENERAL_DESC = 'Febelink es el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic ';

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
export class SearchComponent {
  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  @Input() searchText2: string = '';
  public data: any;
  @Input() type: string = '';

  public slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  recommendations:any;
  searchResponse: any = [];
  offers: any = [];
  locationFilter: string = '';
  sectorFilter: string = '';
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

  services:any =[];

  sectors:any =[];
  locations:any =[];
  locationLinks :any =[];

  locationFilterLink: any[] = [];
  locationFilterLinkFull :any =[];

  metaFilterLink:any =[];
  cities: any = [];

  displayPartialSignUp: boolean = false;
  email: string | null = null;

  locationSelected: any = {}
  professions: any = []
  load: boolean = true;

  h1Title: string | undefined = undefined;

  metas: any = {
    title: '',
    description: ''
  }

  professionalLinks: {
    link: string,
    title: string
  }[] = [];

  provincesLinks: {
    link: string,
    title: string
  }[] = [];

  cityLinks: {
    link: string,
    title: string
  }[] = [];

  constructor(
    public searchService: SearchService,
    private router: Router,
    public authenticationService: AuthenticationService,
    private actRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private title: Title,
    private meta: Meta,
    private keywordService: KeywordService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.professions = []
    this.searchText = this.actRouter.snapshot.paramMap.get('searchTerm') || '';

    this.keywordService.getData().then((data: IHttpService) => {
      this.parseKeywords(data.response as Keywords);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.keywordService.getData(false).then((data: IHttpService) => {
        this.parseKeywords(data.response as Keywords);
       
      });
    }
    // PONE EN EL BUSCADOR EL TEXTO DE LA URL
    this.searchText2 = this.searchText.replace(/-/g, ' ').toLowerCase()
  }

  parseKeywords(data: Keywords) {
    let linkLocation: LinkLocation | undefined = undefined;
    let location: Location | undefined = undefined;
    let city: City | undefined = undefined;
    let sector: Sector | undefined = undefined;
    let subsector: Subsector | undefined = undefined;


    if ( (linkLocation = this.findIntoLinkLocation(data.linklocations, this.searchText)) !== undefined ) {
      this.handleLinkLocationResult(linkLocation);
      this.fillProfessionalLinksWithLinkLocations(data.linklocations, linkLocation.locations_id.id);
    } else if ( (location = this.findIntoLocation(data.locations, this.searchText)) !== undefined ) {
      this.handleLocationResult(location);
      this.fillProfessionalLinksWithLinkLocations(data.linklocations, location.id);
    } else if ( ( city = this.findIntoCity(data.citys, this.searchText)) !== undefined ) {
      this.handleCityResult(city);
      this.fillProfessionalLinksWithLinkLocationsCities(data.linkcitys, city.id);
    } else if ( (sector = this.findIntoSector(data.sector, this.searchText)) !== undefined ) {
      this.handleSectorResult(sector);
      this.fillProfessionalLinksWithSubsectors(data.subsector);
    } else if ( (subsector = this.findIntoSubsector(data.subsector, this.searchText)) !== undefined ) {
      this.handleSubsectorResult(subsector);
      this.fillProfessionalLinksWithSubsectors(data.subsector);
    } else {
      const foundLocation = this.detectLocationIntoQuery(data.locations, this.searchText);
      const foundCity = this.detectCityIntoQuery(data.citys, this.searchText);
      if ( foundLocation !== undefined) {
        this.handleLocationResult(foundLocation);
        this.fillProfessionalLinksWithLinkLocations(data.linklocations, foundLocation.id);
      } else if ( foundCity !== undefined) {
        this.handleLocationResult(foundCity);
        this.fillProfessionalLinksWithLinkLocationsCities(data.linkcitys, foundCity.id);
        this.fillCityLinksWithLocations(data.citys, foundCity.locations_id.id);
      }
        else {
        this.fillProfessionalLinksWithSubsectors(data.subsector);
      }
    }
   


    if ( location !== undefined) {
      this.fillCityLinksWithLocations(data.citys,  location.id);
    } else  if ( city !== undefined) {
      this.fillCityLinksWithLocations(data.citys, city.locations_id.id);
    }  else  if ( linkLocation !== undefined) {
      this.fillCityLinksWithLocations(data.citys, linkLocation.locations_id.id);
    } else {
      this.fillLocationLinksWithLocations(data.locations);
     
    }

    this.search()
  }

  findIntoLinkLocation(linkLocations: LinkLocation[], searchTerm: string): LinkLocation | undefined {
    return linkLocations.find((item: LinkLocation) => item.link === searchTerm);
  }
  findIntoLocation(locations: Location[], searchTerm: string): Location | undefined {
    return locations.find((item: Location) => item.link === searchTerm);
  }
  findIntoCity(cities: City[], searchTerm: string): City | undefined {
    return cities.find((item: City) => item.link === searchTerm);
  }
  findIntoSector(sectors: Sector[], searchTerm: string): Sector | undefined {
    return sectors.find((item: Sector) => item.link === searchTerm);
  }
  findIntoSubsector(subsectors: Subsector[], searchTerm: string): Subsector | undefined {
    return subsectors.find((item: Subsector) => item.link === searchTerm);
  }

  handleLinkLocationResult(linkLocation: LinkLocation) {
    this.h1Title = linkLocation.h1;

    this.seoService.generateTags(
      {
        title: linkLocation.page_title,
        description: linkLocation.description,
        url: `https://febelink.com/listado/${linkLocation.link}`
      }
    );
  }
  handleLocationResult(location: Location) {
    this.h1Title = location.h1;

    this.seoService.generateTags(
      {
        title: location.page_title,
        description: location.meta_description,
        url: `https://febelink.com/listado/${location.link}`
      }
    );
  }

  handleCityResult(city: Location) {
    this.h1Title = city.h1;

    this.seoService.generateTags(
      {
        title: city.page_title,
        description: city.meta_description,
        url: `https://febelink.com/listado/${city.link}`
      }
    );
  }
  handleSectorResult(sector: Sector) {
    this.h1Title = sector.nombre;

    this.seoService.generateTags(
      {
        title: sector.nombre,
        url: `https://febelink.com/listado/${sector.link}`
      }
    );
  }
  handleSubsectorResult(subsector: Subsector) {
    this.h1Title = subsector.h1;

    this.seoService.generateTags(
      {
        title: subsector.page_title,
        description: subsector.meta_description,
        url: `https://febelink.com/listado/${subsector.link}`,
        image: `https://febelink.com/${subsector.imageURL}`
      }
    );
  }
   fillProfessionalLinksWithSubsectors(subsectors: Subsector[]) {
    this.professionalLinks = subsectors
    .filter((subsector: Subsector) => subsector.link !== undefined && subsector.link !== null && subsector.link !== '')
    .map((subsector: Subsector) => {
      return {
        link: subsector.link,
        title: subsector.nombre
      }
    });
  }
  fillProfessionalLinksWithLinkLocations(linkLocations: LinkLocation[], locationId: number) {
    this.professionalLinks = linkLocations
  
    .filter((linkLocation: LinkLocation) => linkLocation.locations_id.id === locationId)
    .map((linkLocation: LinkLocation) => {
      return {
        link: linkLocation.link,
        title: linkLocation.title
      }
    });
  }

  fillProfessionalLinksWithLinkLocationsCities(linkLocations: LinkCity[], cityId: number) {
    this.professionalLinks = linkLocations
  
    .filter((linkLocation: LinkCity) => linkLocation.citys_id.id === cityId)
    .map((linkLocation: LinkCity) => {
      return {
        link: linkLocation.link,
        title: linkLocation.title
      }
    });
  }
  fillLocationLinksWithLocations(locations: Location[]) {
    this.provincesLinks = locations
    .filter((location: Location) => location.link !== undefined && location.link !== null && location.link !== '')
    .map((location: Location) => {
      return {
        link: location.link,
        title: location.title
      }
    });
  }

  fillCityLinksWithLocations(cities: City[], province: number = 0) {
    this.cityLinks = cities
    .filter((city: City) => city.link !== undefined && city.link !== null && city.link !== '' && city.locations_id.id === province)
    .map((city: City) => {
      return {
        link: city.link,
        title: city.title
      }
    });
  }

  detectLocationIntoQuery(locations: Location[], searchTerm: string): Location | undefined {
    const foundLocations = locations
    .filter((location: Location) => {
      return searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(location.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
    });

    return foundLocations ? foundLocations[0] : undefined;
  }

  detectCityIntoQuery(citys: City[], searchTerm: string): City | undefined {
    const foundCitys = citys
    .filter((city: City) => {
      return searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(city.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
    });

    return foundCitys ? foundCitys[0] : undefined;
  }
  clear() {
    this.searchText = '';
    this.searchText2 = '';
  }

  getRecommendations() {

    this.searchService.getRecommendations().then(async (response: any) => {
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
    })
  }

  search(searchTerm?: string, updateFilter: boolean = true) {
    let searchReplace =  this.searchText?.replace(/-/g, ' ').toLowerCase()

    // this.searchService.doofinderSearch(searchReplace).then(async (data: any) => {
    //   this.offers = data.results.map((offer: any) => {
    //     return {
    //       avgRating: offer.avgRating || offer.avgrating,
    //       buttonName: offer.buttonName || offer.buttonname,
    //       description : offer.description,
    //       id: Number(offer.id),
    //       image: offer.image || offer.image_link,
    //       ownerUserId: offer.ownerUserId || offer.owneruserid,
    //       owenrUsername: offer.owenrUsername || offer.owenrusername,
    //       title: offer.title,
    //       unitPrice: offer.unitPrice || offer.unitprice,
    //       unitTypeId: offer.unitTypeId || offer.unittypeid,
    //       verified: offer.verified,
    //       whom: offer.whom,
    //       provincia: offer.provincia,
    //       ciudad: offer.ciudad
    //     }
    //   });
    // })

    this.searchService.getProfessionsByFilter(searchReplace).then( (data) => {
    if (data.response !== undefined) {
        const bestProfessionMatch: number[] = [];
        data.response.forEach((elem: any) => {
          bestProfessionMatch.push(elem.id);
        });
  
        if (bestProfessionMatch.length > 0 || this.searchText) {
          this.searchService.search(   searchReplace, bestProfessionMatch).then(async (data: any) => {
            this.offers = data.response.offers;
            this.searchResponse = data.response;
          })
        }
      }
    }).catch((error: any) => {
      console.error("An error occurred:", error);
    });
  }

 
  search2() {
    if (this.searchText2) {
      let termino  =  slugify(this.searchText2)

      const targetRoute = `/listado/${termino}`;
      // Use the Router to navigate to the new route
      this.router.navigate([targetRoute]);
    }
  }

  searchMoreResults() {
    let otherResultAmount = this.searchResponse?.otherResults?.length;

    if (otherResultAmount < 100 && this.searchText) {

      this.searchService.searchMoreResults(  this.searchText, otherResultAmount + 1).then((response: any) => {
        this.searchResponse.otherResults =
        this.searchResponse.otherResults.concat(response);
      })
    }
  }



  public trackItem(index: number, item: any) {
    return item.trackId;
  }
}
