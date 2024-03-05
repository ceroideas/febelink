import {Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Platform} from '@ionic/angular';
import {UtilitiesService} from '../services/utilities.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {answerOptions} from 'src/utils/utils';
import {IUser} from '../models/user.model';
import {environment} from 'src/environments/environment';
import {AssistantSearchComponent} from './assistant/components/search/search.component';
import {AssistantPopSvc} from './assistant/services/assistant.pop.service';
import {AssistantSearchSvc} from './assistant/services/assistant-search.service';
import {IKeywords} from './assistant/models/assistant.model';
import {SubsectorService} from '../components/sectors/services/subsectores.service';
import {SearchService} from './search/services/search.service';
import SwiperCore, {Pagination, Thumbs} from 'swiper';
import {SeoService} from '../services/seo.service';
import {AuthenticationService} from '../services/authentication/authentication.service';
import {UserService} from '../services/user.service';
import {CuentaProfesionalService} from '../pages/cuenta-profesional/Services/cuenta-profesional.service';
// import {SearchComponent} from './search/components/search/search.component';
import {Meta, Title} from '@angular/platform-browser';
import { KeywordService } from '../admin/keyword/services/keyword.service';

// install Swiper modules
SwiperCore.use([Thumbs, Pagination]);

const GENERAL_TITLE = 'Febelink ¿Qué necesitas? Ofertas de servicios profesionales';
const GENERAL_DESC = 'Febelink es el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic ';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
  currentYear = new Date().getFullYear();
  perfil: IUser = null;
  isLoading: boolean;
  isLogin: any;
  cookies: string;
  filter_hidden: boolean;
  thumbsSwiper: any;

  //SEARCH COMPONENT
  @ViewChild('search') searchComponent_OLD: AssistantSearchComponent; // ToDo: Refactor or remove this deprecated feature

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

  searchTerm: string;

  defaultTitle = 'Encuentra servicios profesionales en tu ciudad';
  generalTitle = this.defaultTitle;

  isIntroImageLoaded: boolean = false;

  locationSearch: string = ''
  termSearch: string = ''
  services = [];

  sectors = [ ];
  locations = [];
  locationLinks = [ ];
  locationFilterLink: any[] = [];
  locationFilterLinkFull = [ ];

  metaFilterLink = [];
  cities= [];
  constructor(
    private api: ApiService,
    public platform: Platform,
    private utilities: UtilitiesService,
    private router: Router,
    private cookSvc: CookieService,
    private activatedRoute: ActivatedRoute,
    private assistantPop: AssistantPopSvc,
    public assistantSearchSvc: AssistantSearchSvc,
    private subsectorSvc: SubsectorService,
    public searchService: SearchService,
    private seoService: SeoService,
    private authenticationService: AuthenticationService,
    private userSvc: UserService,
    private profAccountService: CuentaProfesionalService,
    private cdRef : ChangeDetectorRef,
    private keywordService: KeywordService,
  ) {

    this.leerDatos()

    this.seoService.generateTags({title: GENERAL_TITLE, description: GENERAL_DESC});

    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('searchTerm') !== null && params.get('searchTerm') !== undefined && params.get('searchTerm') !== "" ){
        this.searchTerm = params.get('searchTerm')?.replace(new RegExp('-', 'g'), ' ');
      } else {
        sessionStorage.removeItem("locationFilter");
        sessionStorage.removeItem("metaLocationFilter");      }
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
      this.searchComponent_OLD.text(searchbar);
    }
  }

  ngAfterViewInit(): void {
    if (this.searchTerm) {
      // this.searchPage.search(this.searchTerm, false);
    }
  }


  search(){

    sessionStorage.removeItem("sectorFilter");
    sessionStorage.removeItem("locationFilter"); 
    sessionStorage.removeItem("locationSelected"); 

    if (this.searchTerm) {
    // You can construct the URL for the new route with the parameters
      const targetRoute = `/search/${this.searchTerm}`;

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
    this.searchComponent_OLD.clear();
  }


 async leerDatos(){

    await this.readData()

    this.cdRef.detectChanges();
  }
  
  async readData() {
    const seoData = sessionStorage.getItem('seoData');

    if ( !!seoData ) {
      const response = JSON.parse(seoData);
      this.services = response.sector;
      this.sectors = response.subsector;
      this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
      this.sectors.sort((a, b) => a.nombre.localeCompare(b.nombre));

      this.locations = response.locations;
      this.locationLinks = response.locations
      this.locationFilterLinkFull = response.linklocations;

      this.fetchData();
    } else {
      await this.fetchData();
      this.services = this.services;

      this.sectors = this.sectors;
      this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
      this.sectors.sort((a, b) => a.nombre.localeCompare(b.nombre));
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
    this.services = response.sector;

    this.sectors = response.subsector;
    this.sectors = this.sectors.filter(_se => _se.imageURL !== null && _se.imageURL !== undefined && _se.imageURL !== '')
    this.sectors.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.locations = response.locations;

    this.locationLinks = response.locations
    this.locationFilterLinkFull = response.linklocations;

    sessionStorage.setItem('seoData', JSON.stringify(response));
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

    // Select sector only if url path had value
    if (this.isLoading && this.searchComponent_OLD.text()) {
      this.searchComponent_OLD.getSectorsByKeys();
    }
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
        if (this.perfil.skip_wizard === 0 && this.isLogin === 'login') {
          //if(this.platform.is('cordova')){
          //this.openGuide();
          //}
          this.utilities.setGuia('other');
        }
      }
    });
  }

  OnGotKeys(data) {
    this.assistantPop.show(this.perfil, this.searchComponent_OLD.get());
    this.searchComponent_OLD.clear();
  }

  OnEnter() {
    this.assistantPop.show(this.perfil, this.searchComponent_OLD.get());
    this.searchComponent_OLD.clear();
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
    const recommenderId: string =
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

    if (sector || servicio || busqueda) {
      editedKeywords = this.assistantSearchSvc.get();
      (
        await this.api.getSectorsByKeys(sector ?? servicio ?? busqueda)
      ).subscribe((sectors) => {
        this.assistantSearchSvc.main(sectors.main);

        this.subsectorSvc
          .get(editedKeywords.main?.sector_id)
          .then((subsectors) => {
            const subsector = subsectors.find((elem) => {
              const searchTerm = servicio ?? busqueda;
              return elem.nombre === searchTerm;
            });

            if (editedKeywords.main) {
              this.assistantPop.show(
                this.perfil,
                subsector
                  ? {
                    ...editedKeywords,
                    main: {
                      ...editedKeywords.main,
                      subsector_id: subsector.id,
                      subsector_nombre: subsector.nombre,
                    },
                  }
                  : editedKeywords,
                localidad
              );
            }
          });
      });
    }
  }

  onSwiper([swiper]) {}

  onSlideChange() {}


  changeGeneralTitle(newTitle: string) {
    this.generalTitle = newTitle;
  }




  async changeLocation(location:any) {
    sessionStorage.removeItem("sectorFilter");
    sessionStorage.setItem('locationFilter', JSON.stringify(location.title));
    sessionStorage.setItem('locationSelected', JSON.stringify(location));

  }




  async changeSectorFilter(sectorFilter: any) {
    sessionStorage.removeItem("sectorFilter");
    sessionStorage.removeItem("locationFilter"); 
    sessionStorage.removeItem("locationSelected"); 
   
 
    await this.searchService.setSectorFilter(sectorFilter.nombre);
    sessionStorage.setItem('sectorFilter', sectorFilter.nombre);
  }


  /**NUEVO */
  onIntroImageLoaded() {
    this.isIntroImageLoaded = true;
    this.cdRef.detectChanges();
  }
}
