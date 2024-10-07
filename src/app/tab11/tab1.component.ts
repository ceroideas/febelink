import {Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef, Injectable, PLATFORM_ID, Inject, ElementRef,} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Platform} from '@ionic/angular';
import {UtilitiesService} from '../services/utilities.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {IUser} from '../models/user.model';
import {IKeywords} from './assistant/models/assistant.model';
import {SubsectorService} from '../components/sectors/services/subsectores.service';
import {SearchService} from './search/services/search.service';
import SwiperCore, {Pagination, Thumbs} from 'swiper';
import {SeoService} from '../services/seo.service';
import { KeywordService } from '../admin/keyword/services/keyword.service';
import { environment } from '../../environments/environment';
import { answerOptions, toSlug } from '../../utils/utils';
import { DOCUMENT } from '@angular/common';

import slugify from "slugify";

import { preventDefault } from '../../utils/utils';

import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Keywords } from '../interfaces/keywords';
import { filter } from 'rxjs';
import { IHttpService } from '../services/http.service';
import { Subsector } from '../interfaces/subsector';
import { Sector } from '../interfaces/sector';
import { Location } from '../interfaces/location';
// // install Swiper modules
SwiperCore.use([Thumbs, Pagination]);

const GENERAL_TITLE = 'Febelink | Ofertas de servicios profesionales';
const GENERAL_DESC = 'Febelink es el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic	 ';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.component.html',
  styleUrls: ['tab1.component.scss'],
  
})
export class Tab1Component implements OnInit  {

  @ViewChild('selection') selection: ElementRef | undefined;

  currentYear = new Date().getFullYear();
  perfil: IUser | undefined;
  isLoading: boolean = false;
  isLogin: any;
  cookies: string ="";
  filter_hidden: boolean = false;
  thumbsSwiper: any;

  //SEARCH COMPONENT

  openKeys: boolean = false;
  showCookies = false;
  refreshTab: any;

  answerOptions = answerOptions();
  srcFoto: any;
  base64img: any;
  isNative: boolean = true;
  showCard = false;

  googlestore: string = environment.GOOGLE_STORE;
  appstore: string = environment.APP_STORE;
  urlWsrv: string = environment.baseWebUrlWsrv;
  baseWeb: string = environment.WEB_URL;

  userLogged: boolean = false;

  searchTerm: string = "";

  defaultTitle = 'Encuentra servicios profesionales en tu ciudad';
  generalTitle = this.defaultTitle;

  isIntroImageLoaded: boolean = false;

  locationSearch: string = ''
  termSearch: string = ''
  services :any =  [];

  sectors :any = [ ];
  locations:any = [];
  locationLinks :any = [ ];
  locationFilterLink: any[] = [];
  locationFilterLinkFull :any =  [ ];

  metaFilterLink :any =  [];
  cities:any = [];
  footerLinks:any =  [ ];

  searchText2: string = '';

  dropdownSectors: Sector[] = [];
  filteredSectors: Sector[] = [];

  currentSubSectorSelection: Subsector[] = [];

  dropdownOpened: boolean = false;

  preventDefault = preventDefault;

  basePath = 'servicios';

  constructor(
    private api: ApiService,
    public platform: Platform,
    private utilities: UtilitiesService,
    private router: Router,
    private cookSvc: CookieService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private subsectorSvc: SubsectorService,
    public searchService: SearchService,
    private seoService: SeoService,
    private cdRef : ChangeDetectorRef,
    private keywordService: KeywordService,
    private utilitiesService: UtilitiesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
    this.keywordService.getData().then((data: IHttpService) => {
      this.parseKeywords(data.response as Keywords);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.keywordService.getData(false).then((data: IHttpService) => {
        this.parseKeywords(data.response as Keywords);
      });
    }
    
    this.seoService.generateTags({title: GENERAL_TITLE, description: GENERAL_DESC});

    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('searchTerm') !== null && params.get('searchTerm') !== undefined && params.get('searchTerm') !== "" ){
        //@ts-ignore
        this.searchTerm = params.get('searchTerm')?.replace(new RegExp('-', 'g'), ' ');


        slugify(this.searchTerm, {
          replacement: '-',  // replace spaces with replacement character, defaults to `-`
          remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
          lower: true,      // convert to lower case, defaults to `false`
          strict: false,     // strip special characters except replacement, defaults to `false`
          locale: 'en',      // language code of the locale to use
          trim: true         // trim leading and trailing replacement chars, defaults to `true`
        }
        )
      }
    });
    
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
      this.userLogged = true;
     
      this.obtenerPerfil();
    });

    this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
    if (this.platform.is('cordova')) {
      this.isNative = true;
    } else {
      this.isNative = false;
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params:any) => {
  
      const sector = params['sector'] !== 'null' ? params['sector'] : null;
      const servicio =
        params['servicio'] !== 'null' ? params['servicio'] : null;
      const localidad =
        params['localidad'] !== 'null' ? params['localidad'] : null;
      const busqueda =
        params['busqueda'] !== 'null' ? params['busqueda'] : null;

      if (sector || servicio || localidad || busqueda) {
        this.renderModalWithURLParams(sector, servicio, localidad, busqueda);
      }
    });

    /**
     * If searchbar param passed
     */
    const searchbar = this.activatedRoute.snapshot.paramMap.get('searchbar');
    if (searchbar) {
      this.isLoading = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.searchTerm) {
      // this.searchPage.search(this.searchTerm, false);
    }
  }

  ionViewDidEnter() {
    this.loadData();
    this.recomendation();
  }

  ionViewDidLeave() {
    this.showCard = false;
  }
  
  // async readData() {
  //   const seoData =this.sessionStorage?.getItem('seoData');

  //   if ( seoData!= null ) {
  //     const response = JSON.parse(seoData);
  //     this.services = response.sector;
  //     this.sectors = response.subsector;
  //     //@ts-ignore
  //     this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
  //     this.sectors.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
  //     this.footerLinks =  this.footerLinks;

  //     this.locations = response.locations;
  //     this.locationLinks = response.locations
  //     this.locationFilterLinkFull = response.linklocations;

  //     this.fetchData();
  //   } else {
  //     this.keywordService.getData().then((data) => {
  //       this.services = data.response.sector;
  //       this.sectors = data.response.subsector;
  //       //@ts-ignore
  //       this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
  //       this.sectors.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
  //       this.sessionStorage?.setItem('linksfooter', data.response.links);
  //       this.locations = data.response.locations;
  //       this.locationLinks = data.response.locations
  //       this.locationFilterLinkFull = data.response.linklocations;
  //       this.sessionStorage?.setItem('seoData', JSON.stringify(data.response));
  //     })
  //   }
  // }


  async readDataCity(id:  number) {

    this.keywordService.getLinkCitysLocation(id).then((response: any) => {
      if (response !== undefined) {
        this.cities = response;
      }
    });
    
}

  async readDataCityLocationSector(id:  number, sector:  number) {
    this.keywordService.getLinkCitysLocationSector(id, sector)?.then((response: any) => {
      if (response !== undefined) {
        this.cities = response;
      }
    });
   
  }

  parseKeywords(data: Keywords) {
    this.services = data.sector;

    data.subsector.forEach((subsector: Subsector) => {
      if ( this.basePath === 'servicios' ) {
        subsector.link = `${toSlug(subsector.link.replace('en-españa', '').replace('en-espana', '').replace('en-españa', ''))}`;
      }
    });

    this.sectors = data.subsector;
    this.sectors = this.sectors.filter((_se: any) => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
    this.sectors.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));

    data.locations.forEach((location: Location) => {
      if ( this.basePath === 'servicios' ) {
        location.link = `profesionales/${toSlug(location.title)}`;
      }
    });

    this.locations = data.locations;
    this.locationLinks = data.locations
    this.locationFilterLinkFull = data.linklocations;

    // Configure sector dropdown
    this.dropdownSectors = JSON.parse(JSON.stringify(data.sector));
    this.dropdownSectors.forEach((sector: Sector) => {
      sector.subSectors = JSON.parse(JSON.stringify(data.subsector.filter((subsector: Subsector) => subsector.id_sector?.id === sector.id)));
    
      sector.subSectors.forEach((subsector: Subsector) => {
        if ( this.basePath === 'servicios' ) {
          subsector.link = `${toSlug(subsector.link.replace('en-españa', '').replace('en-espana', '').replace('en-españa', ''))}`;
        }
      });
    });
    this.filteredSectors = this.dropdownSectors;
    this.filteredSectors = this.filteredSectors.filter((sector: Sector) => sector.subSectors.some((subsector: Subsector) => !subsector.hidden));
  }


  checkUserFields(): boolean {
    return (
      this.perfil?.dni !== null &&
      this.perfil?.telefono !== null &&
      this.perfil?.direccion !== null
    );
  }

  async loadData() {
    await this.obtenerPerfil();

 
  }

  async obtenerPerfil() {
    this.cookies = this.cookSvc.get('wizard');
    if (this.cookies === 'wizard') {
      this.showCookies = false;
    } else {
      if (!this.platform.is('cordova') && this.cookies !== 'wizard') {
        //this.openGuide();
      }
      this.cookSvc.set('wizard', 'wizard');
      this.showCookies = true;
    }

    await this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });

    await this.utilities.getUserData().then((data) => {
      this.perfil = data;

      if (this.perfil !== null) {
        if (this.perfil?.skip_wizard === 0 && this.isLogin === 'login') {
          //if(this.platform.is('cordova')){
          //this.openGuide();
          //}
          this.utilities.setGuia('other');
        }
      }
    });
  }

  async openCookies() {
    this.navegar('cookie-policy');
  }

  async openPrivacyPolicy() {
    this.navegar('privacy-policy');
  }

  async openUseConditions() {
    this.navegar('use-conditions');
  }

  closeCookies() {
    this.showCookies = false;
  }

  public navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  gotoSearch() {}

  private recomendation() {
    const recommenderId: any =
      this.activatedRoute.snapshot.paramMap.get('recommenderId');
    if (recommenderId) {
      this.cookSvc.set('recommenderId', recommenderId, 1);
    }
  }

  private async renderModalWithURLParams(
    sector: string,
    servicio: string,
    localidad: string,
    busqueda: string
  ) {
    let editedKeywords: IKeywords;

    // if (sector || servicio || busqueda) {
    //   editedKeywords = this.assistantSearchSvc.get();
    //   (
    //     await this.api.getSectorsByKeys(sector ?? servicio ?? busqueda)
    //   ).subscribe((sectors) => {
    //     // this.assistantSearchSvc.main(sectors.main);

    //     this.subsectorSvc
    //       .get(editedKeywords.main?.sector_id)
    //       .then((subsectors) => {
    //         const subsector = subsectors.find((elem) => {
    //           const searchTerm = servicio ?? busqueda;
    //           return elem.nombre === searchTerm;
    //         });

    //         if (editedKeywords.main) {
    //           // this.assistantPop.show(
    //           //   //@ts-ignore
    //           //   this.perfil,
    //           //   subsector
    //           //     ? {
    //           //       ...editedKeywords,
    //           //       main: {
    //           //         ...editedKeywords.main,
    //           //         subsector_id: subsector.id,
    //           //         subsector_nombre: subsector.nombre,
    //           //       },
    //           //     }
    //           //     : editedKeywords,
    //           //   localidad
    //           // );
    //         }
    //       });
    //   });
    // }
  }

  onSwiper([swiper]: any) {}

  onSlideChange() {}


  changeGeneralTitle(newTitle: string) {
    this.generalTitle = newTitle;
  }

  /**NUEVO */
  onIntroImageLoaded() {
    this.isIntroImageLoaded = true;
    this.cdRef.detectChanges();
  }

  checkSubsector(subsector: Subsector) {
    subsector.checked = !subsector.checked;

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

      this.searchText2 = '';
    }

  }

  filterDropdownItems() {
    this.dropdownSectors.forEach((sector: Sector) => sector.subSectors.forEach((subsector: Subsector) => subsector.hidden = false));

    if ( !!this.searchText2.trim() ) {
      this.filteredSectors = this.dropdownSectors.filter((sector: Sector) => {
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
      this.filteredSectors = this.dropdownSectors;
    }

    this.filteredSectors = this.filteredSectors.filter((sector: Sector) => sector.subSectors.some((subsector: Subsector) => !subsector.hidden));
  }
  
  openDropdown() {
    this.dropdownOpened = true;
  }
  closeDropdown() {
    this.dropdownOpened = false;
  }

  search() {
    let unchechedSubsectors: number[] = [];
    let chechedSubsectors: number[] = [];

    if ( this.searchText2.trim() !== '' ) {
      const searchWords = this.searchText2.split(' ');

      unchechedSubsectors = this.dropdownSectors
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

    chechedSubsectors = this.currentSubSectorSelection.map((subsector: Subsector) => subsector.id);

    const subsectors = encodeURIComponent(JSON.stringify([...chechedSubsectors, ...unchechedSubsectors]));
    this.router.navigate([`/listado`], { queryParams: {subsectors}});
  }
}
