import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, ViewChild, HostListener } from '@angular/core';
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
import { UtilitiesService } from '../services/utilities.service';

import { toSlug, preventDefault } from '../../utils/utils';
import { environment } from '../../environments/environment';
import { Employment } from '../interfaces/employment';
import { ModalService } from '../services/modal.service';

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

  @ViewChild('selection') selection: ElementRef | undefined;

  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  @Input() searchText2: string = '';
  public data: any;
  @Input() type: string = '';

  recommendations:any;
  searchResponse: any = [];
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

  locations:any =[];
  locationLinks :any =[];

  locationFilterLink: any[] = [];
  locationFilterLinkFull :any =[];

  metaFilterLink:any =[];

  displayPartialSignUp: boolean = false;
  email: string | null = null;

  locationSelected: any = {}
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

  currentProfessioanlLink: string | undefined = undefined;

  subSectorDropdownItems: {
    id: number,
    sector_id: number,
    link: string,
    title: string
  }[] = [];

  provinces: Location[] = [];
  provinceDropdownItems: {
    id: number,
    link: string,
    title: string,
    checked: boolean
  }[] = [];

  cities: City[] = [];
  cityDropdownItems: {
    id: number,
    link: string,
    title: string,
    locations_id: { id: number, title: string },
    checked: boolean
  }[] = [];

  currentSubSectorSelection: Subsector[] = [];
  currentProvinceDropdownItem: {id: number, title: string, link: string, checked: boolean}[] = [];
  currentCityDropdownItem: {title: string, link: string, checked: boolean}[] = [];

  targetSubsector: Subsector | undefined = undefined;
  targetLocation: Location | undefined = undefined;
  targetCity: City | undefined = undefined
  targetLinkLocation: LinkLocation | undefined = undefined;
  targetLinkCity: LinkCity | undefined = undefined;

  subSectorDropdown: boolean = false;
  provinceDropdown: boolean = false;
  cityDropdown: boolean = false;

  currentOrderDropdownItem: string | undefined = undefined;
  orderDropdownItems: {title: string, action: () => any}[] = [
    {title: 'Precio menor', action: () => this.orderOffers('asc')},
    {title: 'Precio mayor', action: () => this.orderOffers('desc')},
  ]

  keywords: Keywords | undefined = undefined;

  loading: boolean = false;
  loadingOtherOffers: boolean = false;
  
  sectors: Sector[] = [];
  filteredSectors: Sector[] = [];

  dropdownOpened: boolean = false;

  offers: any[] = [];
  otherOffers: any[] = [];

  otherOffersQuery: string = '';

  otherOffersStartIndex: number = 0;

  subsectorsQuery: number[] | undefined = undefined;

  professionQuery: string = '';
  provinceQuery: string = '';
  cityQuery: string = '';

  preventDefault = preventDefault;

  basePath: 'listado' | 'servicios' = 'servicios';

  currentLinkType: 'none' | 'subsector' | 'location' | 'city' | 'linklocation' | 'linkcity' = 'none';

  employmentLinks: {
    link: string,
    title: string
  }[] = [];

  isMovil: boolean = false;

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
    private utilitiesService: UtilitiesService,
    private modalService: ModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.professionQuery = this.actRouter.snapshot.paramMap.get('profession') || '';
    this.provinceQuery = this.actRouter.snapshot.paramMap.get('province') || '';
    this.cityQuery = this.actRouter.snapshot.paramMap.get('city') || '';

    if ( this.professionQuery === 'profesionales' ) {
      this.professionQuery = 'servicios-profesionales';
    }

    if ( this.professionQuery ) {
      if ( this.provinceQuery && this.cityQuery ) {
        this.searchText = `${this.professionQuery}-en-${this.cityQuery}`;
      } else if ( this.provinceQuery && !this.cityQuery ) {
        this.searchText = `${this.professionQuery}-en-${this.provinceQuery}`;
      } else {
        this.searchText = `${this.professionQuery}-en-espana`;
      }
      
      this.basePath = 'servicios';
    } else {
      this.searchText = this.actRouter.snapshot.paramMap.get('searchTerm') || '';
      this.searchText = this.searchText.replace(/ñ/g, "ñ");
      this.basePath = 'listado';
    }

    this.keywordService.getLinkData(this.searchText).then((data: any) => {
      const response = data.response;

      console.log(response);

      if ( response.subsector?.length ) {
        this.targetSubsector = response.subsector[0];
        this.handleSubsectorResult(response.subsector[0]);
      } else if ( response.locations?.length ) {
        this.targetLocation = response.locations[0];
        this.handleLocationResult(response.locations[0]);
      } else if ( response.citys?.length ) {
        this.targetCity = response.citys[0];
        this.handleCityResult(response.citys[0]);
      } else if ( response.linklocations?.length ) {
        this.targetLinkLocation = response.linklocations[0];
        this.handleLinkLocationResult(response.linklocations[0]);
      } else if ( response.linkcitys?.length ) {
        this.targetLinkCity = response.linkcitys[0];
        this.handleLinkCityResult(response.linkcitys[0]);
      }
    })

    this.actRouter.queryParams.subscribe(params => {
      if ( params['subsectors'] ) {
        this.subsectorsQuery = JSON.parse(decodeURIComponent(params['subsectors']));
      }
    }); 

    this.keywordService.getData().then((data: IHttpService) => {
      this.keywords = data.response as Keywords;

      // Configure sector dropdown
      this.sectors = JSON.parse(JSON.stringify(data.response.sector));
      this.sectors.forEach((sector: Sector) => {
        sector.subSectors = JSON.parse(JSON.stringify(data.response.subsector.filter((subsector: Subsector) => subsector.id_sector?.id === sector.id)));
        
        sector.subSectors.forEach((subsector: Subsector) => {
          if ( this.basePath === 'servicios' ) {
            subsector.link = `${toSlug(subsector.link.replace('en-españa', '').replace('en-espana', '').replace('en-españa', ''))}`;
          }
        });
      });
      this.filteredSectors = this.sectors;
      this.filteredSectors = this.filteredSectors.filter((sector: Sector) => sector.subSectors.some((subsector: Subsector) => !subsector.hidden));

      // Configure locations dropdown
      this.provinces = this.keywords.locations
      .filter((location: Location) => location.link !== undefined && location.link !== null && location.link !== '')
      .sort((a: Location, b: Location) => a.title.localeCompare(b.title))

      this.provinceDropdownItems = this.provinces
      .filter((location: Location) =>  location.title !== 'España')
      .map((location: Location) => {
        return {
          id: location.id,
          link: location.link,
          title: location.title,
          checked: false
        }
      });

      // Configure cities dropdown
      this.cities = this.keywords.citys
      .filter((city: City) => city.link !== undefined && city.link !== null && city.link !== '')
      .sort((a: City, b: City) => a.title.localeCompare(b.title))

      this.cityDropdownItems = this.cities
      .map((city: City) => {
        return {
          id: city.id,
          link: city.link,
          title: city.title,
          locations_id: city.locations_id,
          checked: false
        }
      });
      this.cityDropdownItems.sort((a, b) => a.title.localeCompare(b.title));

      this.parseKeywords(this.keywords);

      this.generateEmploymentLinks();

      if ( !this.restoreCurrentSearch() ) {
        this.findOffers();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loading = true;
    }
  }

  parseKeywords(data: Keywords) {
    let subsector: Subsector | undefined = undefined;
    let location: Location | undefined = undefined;
    let city: City | undefined = undefined;

    if ( this.targetSubsector && (subsector = this.findIntoSubsector(data.subsector, this.searchText)) !== undefined ) {
      // Activate badge
      subsector.checked = false;
      this.currentSubSectorSelection.push(subsector);
      // Set province links based on subsector
      this.setProvinceLinksBasedOnSubsector(subsector);
      // Set city links based on subsector
      this.setCityLinksBasedOnSubsector(subsector);
      // Set canonical metadata
      this.basePath === 'listado' && this.seoService.setCanonical(`servicios/${toSlug(subsector.nombre)}`)
    } else if ( this.targetLocation &&  (location = this.findIntoLocation(data.locations, this.searchText)) !== undefined ) {
      // Activate badge
      this.provinceDropdownItems.find((province: { id: number, link: string, title: string, checked: boolean }) => province.id === location!.id)!.checked = true;
      this.currentProvinceDropdownItem.push({id: location.id, title: location.title, link: location.link, checked: true});
      // Set subsector links based on province
      this.setSubsectorsBasedOnLocation(location!);
      // Set city links based on province
      this.setCityLinksBasedOnProvince(location, data.citys);
    } else if ( this.targetCity &&  (city = this.findIntoCity(data.citys, this.searchText)) !== undefined ) {
      // Get province of city
      location = data.locations.find((location: Location) => location.id === city!.locations_id.id);
      // Activate province badge
      this.provinceDropdownItems.find((province: { id: number, link: string, title: string, checked: boolean }) => province.id === location!.id)!.checked = true;
      this.currentProvinceDropdownItem.push({id: location!.id, title: location!.title, link: location!.link, checked: true});
      // Activate city badge
      this.cityDropdownItems.find((city: { id: number, link: string, title: string, checked: boolean }) => city.id === city!.id)!.checked = true;
      this.currentCityDropdownItem.push({title: city.title, link: city.link, checked: true});
      // Set subsector links based on city
      this.setSubsectorsBasedOnCity(city!);
    } else if ( this.targetLinkLocation ) {
      // Get subsector
      subsector = data.subsector.find((subsector: Subsector) => subsector.id === this.targetLinkLocation!.subsector_id);
      // @ts-ignore Get province 
      location = data.locations.find((location: Location) => location.id === this.targetLinkLocation!.locations_id);
      // Activate subsector badges
      data.subsector
      .filter((s: Subsector) => s.id === subsector?.id && !!s.link)
      .forEach((subsector: Subsector) => { subsector.checked = false; this.currentSubSectorSelection.push(subsector) });
      // Activate province badge
      this.provinceDropdownItems.find((province: { id: number, link: string, title: string, checked: boolean }) => province.id === location!.id)!.checked = true;
      this.currentProvinceDropdownItem.push({id: location!.id, title: location!.title, link: location!.link, checked: true});
      // Set subsector links based on province
      this.setSubsectorsBasedOnLocation(location!);
      // Set province links based on subsector
      this.setProvinceLinksBasedOnSubsector(subsector!);
      // Set city links based on subsector and province
      this.setCityLinksBasedOnSubsectorAndProvince(subsector!, location!, data.citys, data.linkcitys);
      // Set canonical metadata
      this.basePath === 'listado' && this.seoService.setCanonical(`servicios/${toSlug(subsector!.nombre)}/${toSlug(location!.title)}`);
    } else if ( this.targetLinkCity ) {
      // @ts-ignore Get subsector
      subsector = data.subsector.find((subsector: Subsector) => subsector.id === this.targetLinkCity!.subsector_id);
      // @ts-ignore Get province
      location = data.locations.find((location: Location) => location.id === this.targetLinkCity!.locations_id);
      // @ts-ignore Get city
      city = data.citys.find((city: City) => city.id === this.targetLinkCity!.citys_id);
      // Activate subsector badges
      data.subsector
      // @ts-ignore Get
      .filter((s: Subsector) => s.id === subsector.id && !!s.link)
      .forEach((subsector: Subsector) => { subsector.checked = false; this.currentSubSectorSelection.push(subsector) });
      // Activate province badge
      this.provinceDropdownItems.find((province: { id: number, link: string, title: string, checked: boolean }) => province.id === location!.id)!.checked = true;
      this.currentProvinceDropdownItem.push({id: location!.id, title: location!.title, link: location!.link, checked: true});
      // Activate city badge
      this.cityDropdownItems.find((city: { id: number, link: string, title: string, checked: boolean }) => city.id === city!.id)!.checked = true;
      this.currentCityDropdownItem.push({title: city!.title, link: city!.link, checked: true});
      // Set subsector links based on city or fallback province
      this.setSubsectorsBasedOnCity(city!);
      // Set province links based on subsector
      this.setProvinceLinksBasedOnSubsector(subsector!);
      // Set city links based on subsector
      this.setCityLinksBasedOnSubsector(subsector!);
      // Set canonical metadata
      this.basePath === 'listado' && this.seoService.setCanonical(`servicios/${toSlug(subsector!.nombre)}/${toSlug(location!.title)}/${toSlug(city!.title)}`);
    }

    if ( isPlatformBrowser(this.platformId) ) {
      this.subsectorsQuery?.forEach((subsectorId: number) => {
        const subsector: Subsector | undefined = data.subsector.find((subsector: Subsector) => subsector.id === subsectorId);
        if ( subsector ) {
          this.checkSubsector(subsector);
        }
      })
    }
  }

  setSubsectorsBasedOnLocation(location: Location) {
    this.sectors.forEach((sector: Sector) => {
      sector.subSectors
      .filter((subsector: Subsector) => !!subsector.link)
      .forEach((subsector: Subsector) => {
        if ( this.basePath === 'servicios' ) {
          subsector.link = `${toSlug(subsector.nombre.toLocaleLowerCase())}/${this.provinceQuery}`;
        } else {
          subsector.link = subsector.link.replace('españa', `${toSlug(location.title)}`).replace('españa', `${toSlug(location.title)}`);
        }
      });
    });
  }
  setSubsectorsBasedOnCity(city: City) {
    this.sectors.forEach((sector: Sector) => {
      sector.subSectors
      .filter((subsector: Subsector) => !!subsector.link)
      .forEach((subsector: Subsector) => {
        if ( this.basePath === 'servicios' ) {
          subsector.link = `${toSlug(subsector.nombre.toLocaleLowerCase())}/${this.cityQuery}`;
        } else {
          subsector.link = subsector.link.replace('españa', `${toSlug(city.title)}`).replace('españa', `${toSlug(city.title)}`);
        }
      });
    });
  }
  setProvinceLinksBasedOnSubsector(subsector: Subsector) {
    this.provinceDropdownItems.forEach((province: { id: number, link: string, title: string }) => {
      if ( this.basePath === 'servicios' ) {
        province.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(province.title.toLocaleLowerCase())}`;
      } else {
        province.link = subsector.link.replace('españa', `${toSlug(province.title)}`).replace('españa', `${toSlug(province.title)}`);
      }
    });
  }
  setCityLinksBasedOnSubsector(subsector: Subsector) {
    this.cities.forEach((city: City) => {
      if ( this.basePath === 'servicios' ) {
        city.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(city.locations_id.title.toLocaleLowerCase())}/${toSlug(city.title.toLocaleLowerCase())}`;
      } else {
        city.link = subsector.link.replace('españa', `${toSlug(city.title)}`).replace('españa', `${toSlug(city.title)}`);
      }
    });

    this.cityDropdownItems.forEach((city: { id: number, link: string, title: string, locations_id: { id: number, title: string } }) => {
      if ( this.basePath === 'servicios' ) {
        city.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(city.locations_id.title.toLocaleLowerCase())}/${toSlug(city.title.toLocaleLowerCase())}`;
      } else {
        city.link = subsector.link.replace('españa', `${toSlug(city.title)}`).replace('españa', `${toSlug(city.title)}`);
      }
    });
  }
  setCityLinksBasedOnProvince(location: Location, cities: City[]) {
    this.cityDropdownItems = cities.filter((city: City) => city.locations_id.id === location.id);
    this.cityDropdownItems.sort((a, b) => a.title.localeCompare(b.title));

    this.cities.forEach((city: City) => {
      if ( this.basePath === 'servicios' ) {
        city.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(city.locations_id.title.toLocaleLowerCase())}/${toSlug(city.title.toLocaleLowerCase())}`;
      }
    });
    this.cityDropdownItems.forEach((city: { id: number, link: string, title: string }) => {
      if ( this.basePath === 'servicios' ) {
        city.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(location.title.toLocaleLowerCase())}/${toSlug(city.title.toLocaleLowerCase())}`;
      }
    });
  }
  setCityLinksBasedOnSubsectorAndProvince(subsector: Subsector, location: Location, cities: City[], linkCitys: LinkCity[]) {
    this.cityDropdownItems = cities.filter((city: City) => city.locations_id.id === location.id);
    this.cityDropdownItems.sort((a, b) => a.title.localeCompare(b.title));

    this.cities.forEach((city: City) => {
      if ( this.basePath === 'servicios' ) {
        city.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(city.locations_id.title.toLocaleLowerCase())}/${toSlug(city.title.toLocaleLowerCase())}`;
      } else {
        city.link = subsector.link.replace('españa', `${toSlug(city.title)}`).replace('españa', `${toSlug(city.title)}`);
      }
    });
    this.cityDropdownItems.forEach((city: { id: number, link: string, title: string }) => {
      if ( this.basePath === 'servicios' ) {
        city.link = `${this.professionQuery === 'servicios-profesionales' ? 'profesionales' : this.professionQuery}/${toSlug(location.title.toLocaleLowerCase())}/${toSlug(city.title.toLocaleLowerCase())}`;
      } else {
        city.link = subsector.link.replace('españa', `${toSlug(city.title)}`).replace('españa', `${toSlug(city.title)}`);
      }
    });
  }

  findIntoLinkLocation(linkLocations: LinkLocation[], searchTerm: string): LinkLocation | undefined {
    return linkLocations.find((item: LinkLocation) => item.link === searchTerm);
  }
  findIntoLinkCity(linkCitys: LinkCity[], searchTerm: string): LinkCity | undefined { 
    return linkCitys.find((item: LinkCity) => item.link === searchTerm);
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

    this.currentLinkType = 'linklocation';

    this.seoService.generateTags(
      {
        title: linkLocation.page_title,
        description: linkLocation.description,
        url: `${environment.WEB_URL}${this.basePath}/${linkLocation.link}`
      }
    );
  }
  handleLinkCityResult(linkCity: LinkCity) {
    this.h1Title = linkCity.h1;

    this.currentLinkType = 'linkcity';

    this.seoService.generateTags(
      {
        title: linkCity.page_title,
        description: linkCity.description,
        url: `${environment.WEB_URL}${this.basePath}/${linkCity.link}`
      }
    );
  }
  handleLocationResult(location: Location) {
    this.h1Title = location.h1;

    this.currentLinkType = 'location';

    this.seoService.generateTags(
      {
        title: location.page_title,
        description: location.meta_description,
        url: `${environment.WEB_URL}${this.basePath}/${location.link}`
      }
    );
  }
  handleCityResult(city: Location) {
    this.h1Title = city.h1;

    this.currentLinkType = 'city';

    this.seoService.generateTags(
      {
        title: city.page_title,
        description: city.meta_description,
        url: `${environment.WEB_URL}${this.basePath}/${city.link}`
      }
    );
  }
  handleSubsectorResult(subsector: Subsector) {
    this.h1Title = subsector.h1;

    this.currentLinkType = 'subsector';

    this.seoService.generateTags(
      {
        title: subsector.page_title,
        description: subsector.meta_description,
        url: `${environment.WEB_URL}${this.basePath}/${subsector.link}`,
        image: `${environment.WEB_URL}${subsector.imageURL}`
      }
    );
  }

  startLoading() {
    this.loading = true;
    this.cdRef.detectChanges();
  }


    //Test ceroideas poagination
    allRecords: any[] = [];
    displayedRecords: any[] = [];
    chunkSize = 10;
    isLoading = false;
    currentIndex = 0;
    currentPage: number = 1;
    @ViewChild('buttonResults') buttonResults!: ElementRef<HTMLButtonElement>;
    @ViewChild('divResults') divResults!: ElementRef<HTMLDivElement>;
    @ViewChild('searchTop') searchTop!: ElementRef;

    ngAfterViewInit():void {
        if (isPlatformBrowser(this.platformId)) {
            this.isMovil = window.innerWidth <= 768 ? true : false;
        }
        setTimeout(() => {
            const appSearchElement = document.querySelector('app-search');
            if (appSearchElement) {
                appSearchElement.addEventListener('scroll', this.onScrollVerify.bind(this));
            }
        }, 0);
    }

    scrollToSearch() {
        this.searchTop?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    get totalPages(): number {
        return Math.ceil(this.allRecords.length / this.chunkSize);
    }

    get paginatedData(): any[] {
        const start = (this.currentPage - 1) * this.chunkSize;
        const end = start + this.chunkSize;
        return this.allRecords.slice(start, end);
    }

    get displayedData(): any[] {
        return this.isMovil ? this.displayedRecords : this.paginatedData;
    }

    changePage(page: number | string) {
        if (page === '...') return;
        this.currentPage = page as number;
        if (!this.isMovil) {
            this.scrollToSearch();
        }
    }

    previousPage() {
        if (this.currentPage > 1) this.currentPage--;
        this.scrollToSearch();
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;

            const nextChunk = this.paginatedData;

            if (this.isMovil) {
                this.displayedRecords = [...this.displayedRecords, ...nextChunk];
            } else {
                this.displayedRecords = nextChunk;
                this.scrollToSearch();
            }
        }
    }

    get visiblePages(): (number | string)[] {
        const total = this.totalPages;
        const current = this.currentPage;
        const pages: (number | string)[] = [];

        if (total <= 10) {
          for (let i = 1; i <= total; i++) pages.push(i);
        } else {
          if (current <= 10) {
            pages.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
          } else {
            pages.push(
                1, 
                current - 7, 
                current - 6, 
                current - 5, 
                current - 4, 
                current - 3, 
                current - 2, 
                current - 1, 
                current, 
                current + 1,
            );
          }
        }

        return pages;
    }

    onScrollVerify() {
        const button = document.getElementById('buttonResults');
        if (button) {
            const rect = button.getBoundingClientRect();
            const distanciaAlBoton = rect.top;

            if (distanciaAlBoton >= 0 && distanciaAlBoton <= window.innerHeight + 2000) {
                if(this.isMovil){
                    this.nextPage();
                }
            }
        }
    }

    loadNextChunk() {
        if (this.currentIndex >= this.allRecords.length) {
          return;
        }

        const nextRecords = this.allRecords.slice(this.currentIndex, this.currentIndex + this.chunkSize);
        this.displayedRecords = [...this.displayedRecords, ...nextRecords];

        this.currentIndex += this.chunkSize;
    }

    loadMoreResults() {
        this.loadNextChunk();
    }
    //End Ceroideas test pagination

    findOffers() {
        this.isLoading = true;
        this.closeDropdown();
        let uncheckedSubsectors: number[] = [];

        if ( this.searchText2.trim() !== '' ) {
          const searchWords = this.searchText2.split(' ');

          uncheckedSubsectors = this.sectors
          .map((sector: Sector) => 
            sector.subSectors.filter((subsector: Subsector) => 
              !subsector.hidden && 
              !subsector.checked && 
              subsector.keySearch.some((key) => searchWords.includes(key.key_name))
            )
          )
          .flat()
          .map((subsector: Subsector) => subsector.id);
        }

        const subsectors: number[] = this.currentSubSectorSelection.map((subsector: Subsector) => subsector.id);
        const provinces: number[] = this.currentProvinceDropdownItem.map((province: { id: number, title: string, link: string, checked: boolean }) => province.id);
        const cities: string[] = this.currentCityDropdownItem.map((city: { title: string, link: string, checked: boolean }) => city.title);

        this.searchService.findOffers([...subsectors, ...uncheckedSubsectors], provinces, cities)
        .then((data) => {
          if ( data && data.response && data.response ) {
            // this.offers = data.response;
            this.allRecords = data.response;
            // this.loadNextChunk();
            this.changePage(1);
            this.isLoading = false;
          } else {
            this.allRecords = [];
            // this.offers = [];
          }

          if(provinces[0]){
            sessionStorage.setItem('active_prov', provinces[0].toString());
          }

          this.otherOffers = [];
          this.otherOffersStartIndex = 0;

          this.loading = false;
          this.cdRef.detectChanges();
        })
        .catch((error: any) => {
          this.loading = false;
          this.cdRef.detectChanges();
        });
    }
  findOtherOffers() {
    this.loadingOtherOffers = true;
    this.cdRef.detectChanges();

    let uncheckedSubsectors: number[] = [];

    if ( this.searchText2.trim() !== '' ) {
      const searchWords = this.searchText2.split(' ');

      uncheckedSubsectors = this.sectors
      .map((sector: Sector) => 
        sector.subSectors.filter((subsector: Subsector) => 
          !subsector.hidden && 
          !subsector.checked && 
          subsector.keySearch.some((key) => searchWords.includes(key.key_name))
        )
      )
      .flat()
      .map((subsector: Subsector) => subsector.id);
    }

    const subsectors: number[] = this.currentSubSectorSelection.map((subsector: Subsector) => subsector.id);

    this.searchService.findOtherOffers([...subsectors, ...uncheckedSubsectors], this.otherOffersStartIndex)
    .then((data) => {
      if ( data && data.response ) {
        this.otherOffers = [...this.otherOffers, ...data.response];
        this.otherOffersStartIndex += 10;
      } else {
        this.otherOffers = [];
        this.otherOffersStartIndex = 0;
      }
    })
    .finally(() => {
      this.loadingOtherOffers = false;
      this.cdRef.detectChanges();
    })
  }

  checkSubsector(subsector: Subsector) {
    if (this.currentSubSectorSelection.some((item: Subsector) => item.id === subsector.id)) {
      subsector.checked = false;
    } else {
      subsector.checked = true;
    }

    if ( subsector.checked ) {
      this.currentSubSectorSelection.push(subsector);
    } else {
      this.currentSubSectorSelection = this.currentSubSectorSelection.filter((item: Subsector) => item.id !== subsector.id);
    }

    if (isPlatformBrowser(this.platformId)) {
      this.cdRef.detectChanges();
      this.selection?.nativeElement.scrollTo({
        top: 0,
        left: this.selection?.nativeElement.scrollWidth,
        behavior: "smooth",
      });

      // Filter offers
      this.findOffers();
      // this.findOtherOffers();
      this.setMetadataBasedOnSelection();

      this.searchText2 = '';
      this.closeDropdown();
    }
  }
  provinceDropdownItemClicked(item: {title: string, link: string}) {
    if (isPlatformBrowser(this.platformId)) {
      // Filter offers
      this.findOffers();
      // this.findOtherOffers();
      this.setMetadataBasedOnSelection();
    }
  }
  updateCurrentProvinceDropdownItem($event: any) {
    this.currentProvinceDropdownItem = $event;
    this.cityDropdownItems = this.cities.filter((city: City) => city.locations_id.id === this.currentProvinceDropdownItem[0]?.id);
  }
  cityDropdownItemClicked(item: {title: string, link: string}) {
    if (isPlatformBrowser(this.platformId)) {
      // Filter offers
      this.findOffers();
      // this.findOtherOffers();
      this.setMetadataBasedOnSelection();
    }
  }

  setMetadataBasedOnSelection() {
    let url: string = `${environment.WEB_URL}${this.basePath}/`;

    this.currentSubSectorSelection.length === 1 
      ? this.h1Title = `Servicios de ${this.currentSubSectorSelection[0].nombre}`
      : this.h1Title = 'Ofertas de servicios profesionales';

    if ( this.currentCityDropdownItem.length === 1 ) {
      this.h1Title = `${this.h1Title} en ${this.currentCityDropdownItem[0].title}`;
      if ( this.currentCityDropdownItem[0]?.link ) {
        url = `${url}${this.currentCityDropdownItem[0].link}`;
      }
    } else if ( this.currentProvinceDropdownItem.length === 1 ) {
      this.h1Title = `${this.h1Title} en ${this.currentProvinceDropdownItem[0].title}`;
      if ( this.currentProvinceDropdownItem[0]?.link ) {
        url = `${url}${this.currentProvinceDropdownItem[0].link}`;
      }
    } else if (this.currentSubSectorSelection.length === 1 && this.currentSubSectorSelection[0]?.link ) {
      url = `${url}${this.currentSubSectorSelection[0].link}`;
    } else {
      this.h1Title = `${this.h1Title} en España`;
    }

    this.cityDropdownItems = this.cities
    .filter((city: City) => this.currentProvinceDropdownItem.some((item: any) => item.id === city.locations_id.id))
    .map((city: City) => {
      return {
        id: city.id,
        link: city.link,
        title: city.title,
        locations_id: city.locations_id,
        checked: false
      }
    });

    this.seoService.generateTags(
      {
        title: this.h1Title,
        url: url
      }
    );
  }

  filterDropdownItems() {
    this.sectors.forEach((sector: Sector) => sector.subSectors.forEach((subsector: Subsector) => subsector.hidden = false));

    if ( !!this.searchText2.trim() ) {
      this.filteredSectors = this.sectors.filter((sector: Sector) => {
        if ( sector.keySearch.some((key) => this.utilitiesService.normalizeString(key.key_name).includes(this.utilitiesService.normalizeString(this.searchText2))) ) {
          return true;
        } else if ( sector.subSectors.some((subsector: Subsector) => subsector.keySearch.some((key) => this.utilitiesService.normalizeString(key.key_name).includes(this.utilitiesService.normalizeString(this.searchText2)))) ) {
          return true;
        } else {
          return false;
        }
      });

      this.filteredSectors.forEach((sector: Sector) =>
        sector.subSectors
          .filter((subsector: Subsector) => 
            !subsector.keySearch.some((key) => this.utilitiesService.normalizeString(key.key_name).includes(this.utilitiesService.normalizeString(this.searchText2))) &&
            !this.utilitiesService.normalizeString(subsector.nombre).includes(this.utilitiesService.normalizeString(this.searchText2))
          )
          .forEach((subsector: Subsector) => subsector.hidden = true)
      );
    } else {
      this.filteredSectors = this.sectors;
    }

    this.filteredSectors = this.filteredSectors.filter((sector: Sector) => sector.subSectors.some((subsector: Subsector) => !subsector.hidden));
  }

  openDropdown() {
    this.dropdownOpened = true;
  }
  closeDropdown() {
    this.dropdownOpened = false;
  }

  orderOffers(order: 'asc' | 'desc' = 'desc') {
    if ( order === 'asc' ) {
      this.currentOrderDropdownItem !== 'Precio menor' ? this.currentOrderDropdownItem = 'Precio menor' : this.currentOrderDropdownItem = undefined;
      
      if ( this.currentOrderDropdownItem === 'Precio menor' ) {
        this.allRecords.sort((a: any, b: any) => Number(a.unitPrice) - Number(b.unitPrice));
        // this.offers.sort((a: any, b: any) => Number(a.unitPrice) - Number(b.unitPrice));
      } else {
        this.allRecords.sort((a: any, b: any) => b.id - a.id);
        // this.offers.sort((a: any, b: any) => b.id - a.id);
      }
    } else if ( order === 'desc' ) {
      this.currentOrderDropdownItem !== 'Precio mayor' ? this.currentOrderDropdownItem = 'Precio mayor' : this.currentOrderDropdownItem = undefined;
      
      if ( this.currentOrderDropdownItem === 'Precio mayor' ) {
        this.allRecords.sort((a: any, b: any) => Number(b.unitPrice) - Number(a.unitPrice));
        // this.offers.sort((a: any, b: any) => Number(b.unitPrice) - Number(a.unitPrice));
      } else {
        this.allRecords.sort((a: any, b: any) => b.id - a.id);
        // this.offers.sort((a: any, b: any) => b.id - a.id);
      }
    }
  }

  storeCurrentSearch() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('currentSearch', JSON.stringify({
        currentSubSectorSelection: this.currentSubSectorSelection,
        currentProvinceDropdownItem: this.currentProvinceDropdownItem,
        currentCityDropdownItem: this.currentCityDropdownItem
      }));
    }
  }
  clearCurrentSearch() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentSearch');
    }
  }
  restoreCurrentSearch(): boolean {
    if ( isPlatformBrowser(this.platformId)) {
      const currentSearch = JSON.parse(sessionStorage.getItem('currentSearch') || '{}');
      this.clearCurrentSearch();
      
      if ( currentSearch.currentSubSectorSelection?.length || currentSearch.currentProvinceDropdownItem?.length || currentSearch.currentCityDropdownItem?.length ) {
        this.currentSubSectorSelection = currentSearch.currentSubSectorSelection || [];
        this.currentProvinceDropdownItem = currentSearch.currentProvinceDropdownItem || [];
        this.currentCityDropdownItem = currentSearch.currentCityDropdownItem || [];
        this.findOffers();
        this.setMetadataBasedOnSelection();

        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  generateEmploymentLinks() {
    let employments: (Employment | undefined)[] = [];
    let employment: Employment | undefined = undefined;
    let shuffled: any[] = [];
    let selected: any[] = [];

    switch ( this.currentLinkType ) {
      case 'subsector':
        employment = this.sectors
          .map((sector: Sector) => sector.subSectors)
          .flat()
          .find((subsector: Subsector) => subsector.id === this.targetSubsector?.id)?.employment;

        shuffled = this.provinces.sort(() => 0.5 - Math.random());
        selected = shuffled.sort((a: Location, b: Location) => a.title.localeCompare(b.title));

        this.employmentLinks = selected.map((location: Location) => {
          return {
            link: `es/trabajos/${toSlug(employment?.title || '')}/${toSlug(location.title)}`,
            title: `${location.title}`
          }
        });
        break;
      case 'location':
        employments = this.sectors
          .map((sector: Sector) => sector.subSectors)
          .flat()
          .map((subsector: Subsector) => subsector.employment)
        
        shuffled = employments.sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 50).sort((a: Location, b: Location) => a.title.localeCompare(b.title));
        
        this.employmentLinks = selected.map((employment: Employment) => {
          return {
            link: `es/trabajos/${toSlug(employment.title)}/${toSlug(this.targetLocation?.title || '')}`,
            title: `${employment.title}`
          }
        });
        break;
      case 'city':
        employments = this.sectors
          .map((sector: Sector) => sector.subSectors)
          .flat()
          .map((subsector: Subsector) => subsector.employment)
        
        shuffled = employments.sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 50).sort((a: Location, b: Location) => a.title.localeCompare(b.title));
        
        this.employmentLinks = selected.map((employment: Employment) => {
          return {
            link: `es/trabajos/${toSlug(employment.title)}/${toSlug(this.targetCity?.location.title || '')}/${toSlug(this.targetCity?.title || '')}`,
            title: `${employment.title}`
          }
        });
        break;
      case 'linklocation':
        employment = this.sectors
          .map((sector: Sector) => sector.subSectors)
          .flat()
          .find((subsector: Subsector) => subsector.id === this.targetLinkLocation?.subsector_id)?.employment;

        shuffled = this.provinces.sort(() => 0.5 - Math.random());
        selected = shuffled.sort((a: Location, b: Location) => a.title.localeCompare(b.title));

        this.employmentLinks = selected.map((location: Location) => {
          return {
            link: `es/trabajos/${toSlug(employment?.title || '')}/${toSlug(location.title)}`,
            title: `${location.title}`
          }
        });
        break;
      case 'linkcity':
        employment = this.sectors
          .map((sector: Sector) => sector.subSectors)
          .flat()
          .find((subsector: Subsector) => subsector.id === Number(this.targetLinkCity?.subsector_id))?.employment;

        const province = this.provinces.find((province: Location) => province.id === Number(this.targetLinkCity?.locations_id));
        const cities = this.cities.filter((city: City) => city.locations_id.id === province?.id);

        shuffled = this.provinces.sort(() => 0.5 - Math.random());
        selected = shuffled.sort((a: Location, b: Location) => a.title.localeCompare(b.title));

        this.employmentLinks = cities.map((city: City, index: number) => {
          return {
            link: `es/trabajos/${toSlug(employment?.title || '')}/${toSlug(city.locations_id.title)}/${toSlug(city.title)}`,
            title: `${city.title}`
          }
        });
        break;
      default:
        employments = this.sectors
          .map((sector: Sector) => sector.subSectors)
          .flat()
          .map((subsector: Subsector) => subsector.employment)
        
        shuffled = employments.sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 50).sort((a: Location, b: Location) => a.title.localeCompare(b.title));
        
        this.employmentLinks = selected.map((employment: Employment) => {
          return {
            link: `es/trabajos/${toSlug(employment.title)}`,
            title: `${employment.title}`
          }
        });
        break;
    }
  }

  askForBudget() {
    this.modalService.openAskForBudgetModal();
  }
}
