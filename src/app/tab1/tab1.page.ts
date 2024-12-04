import {Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef, Injectable, PLATFORM_ID, Inject,} from '@angular/core';
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
import { answerOptions } from '../../utils/utils';
import { DOCUMENT } from '@angular/common';


import { isPlatformBrowser } from '@angular/common';
// // install Swiper modules
SwiperCore.use([Thumbs, Pagination]);

const GENERAL_TITLE = 'Febelink ¿Qué necesitas? Ofertas de servicios profesionales';
const GENERAL_DESC = 'Febelink es el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic ';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  
})
export class Tab1Page  {
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
  sessionStorage = document.defaultView?.sessionStorage;
  constructor(
    private api: ApiService,
    public platform: Platform,
    private utilities: UtilitiesService,
    private router: Router,
    private cookSvc: CookieService,
    private activatedRoute: ActivatedRoute,
    private subsectorSvc: SubsectorService,
    public searchService: SearchService,
    private seoService: SeoService,
    private cdRef : ChangeDetectorRef,
    private keywordService: KeywordService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
     
    if (isPlatformBrowser(this.platformId)) {
      this.sessionStorage = this.sessionStorage ;
    } else {
      // Implementación alternativa para el servidor
      this.sessionStorage  = undefined;
    }


    this.leerDatos()

    this.seoService.generateTags({title: GENERAL_TITLE, description: GENERAL_DESC});

    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('searchTerm') !== null && params.get('searchTerm') !== undefined && params.get('searchTerm') !== "" ){
        //@ts-ignore
        this.searchTerm = params.get('searchTerm')?.replace(new RegExp('-', 'g'), ' ');
      } else {
        this.sessionStorage?.removeItem("locationFilter");
       this.sessionStorage?.removeItem("metaLocationFilter");      }
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
    this.activatedRoute.queryParams.subscribe((params) => {
  
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


  search(){

    
   this.sessionStorage?.removeItem("sectorFilter");
   this.sessionStorage?.removeItem("locationFilter"); 
   this.sessionStorage?.removeItem("locationSelected"); 
    

    if (this.searchTerm) {
    // You can construct the URL for the new route with the parameters
      const targetRoute = `/servicios/${this.searchTerm}`;

      // Use the Router to navigate to the new route
      this.router.navigate([targetRoute]);
    }
  }
  ionViewDidEnter() {
    this.loadData();
    this.recomendation();
  }

  ionViewDidLeave() {
    this.showCard = false;
  }


 async leerDatos(){

    await this.readData()

    this.cdRef.detectChanges();
  }
  
  async readData() {
    const seoData =this.sessionStorage?.getItem('seoData');

    if ( seoData!= null ) {
      const response = JSON.parse(seoData);
      this.services = response.sector;
      this.sectors = response.subsector;
      //@ts-ignore
      this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
      this.sectors.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.footerLinks =  this.footerLinks;

      this.locations = response.locations;
      this.locationLinks = response.locations
      this.locationFilterLinkFull = response.linklocations;

      this.fetchData();
    } else {
   

      const response = await this.keywordService.getData();
      await this.fetchData();
      this.services = this.services;

      this.sectors = this.sectors;
      //@ts-ignore
      this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
      this.sectors.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
    }



  


  }


  async readDataCity(id:  number) {
    const result = await this.keywordService.getLinkCitysLocation(id);
    if (result && 'response' in result) {
        this.cities = result.response;
    } else {
        // Handle the case where the result is not as expected
    }
}

  async readDataCityLocationSector(id:  number, sector:  number) {
   
    const result =  await this.keywordService.getLinkCitysLocationSector(id, sector)
    if (result && 'response' in result) {
        this.cities = result.response;
    } else {
        // Handle the case where the result is not as expected
    }
  }

  async fetchData() {
  //   const response = await this.keywordService.getData();
  
  //   this.services = response.sector;

  //   this.sectors = response.subsector;
  //     //@ts-ignore

  //   this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
  //   this.sectors.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));

  //  this.sessionStorage?.setItem('linksfooter', response.links);
    
  //   this.locations = response.locations;

  //   this.locationLinks = response.locations
  //   this.locationFilterLinkFull = response.linklocations;

  //  this.sessionStorage?.setItem('seoData', JSON.stringify(response));
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




  async changeLocation(location:any) {
   this.sessionStorage?.removeItem("sectorFilter");
   this.sessionStorage?.setItem('locationFilter', JSON.stringify(location.title));
   this.sessionStorage?.setItem('locationSelected', JSON.stringify(location));

  }




  async changeSectorFilter(sectorFilter: any) {
   this.sessionStorage?.setItem('nenenenenne', '11');


   this.sessionStorage?.removeItem("sectorFilter");
   this.sessionStorage?.removeItem("locationFilter"); 
   this.sessionStorage?.removeItem("locationSelected"); 
   
 
  await this.searchService.setSectorFilter(sectorFilter.nombre);
   this.sessionStorage?.setItem('sectorFilter', sectorFilter.nombre);

   this.router.navigate(['listado/'+sectorFilter.link])
  }


  /**NUEVO */
  onIntroImageLoaded() {
    this.isIntroImageLoaded = true;
    this.cdRef.detectChanges();
  }
}
