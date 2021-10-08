import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GuidePage } from '../pages/guide/guide.page';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ISearch } from '../models/search.model';
import { ISector, ISubSector } from '../models/sector.model';
import { IUser } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { DemandaService } from '../services/demanda.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  searchParam: string = '';
  provinceParam: string = '';

  currentYear = new Date().getFullYear();
  currentUser: IUser = null;
  demandas: any;
  isLoading: boolean;
  sectors: ISector[] = [];
  subSectors: ISubSector[] = [];
  subsector: any;
  sector: any;
  provinces: any[] = [];
  province: any;
  towns: any[] = [];
  town: any;
  demandasCategoria: any = [];
  demandasProvincia: any = [];
  searchResults: ISearch[] = [];
  isLogin: any;
  refreshTab: any;
  showFilters = false;

  constructor(
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private demanadaSvc: DemandaService,
    private seoSvc:SeoService,
  ) {
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
      this.getUserProfile();
    });

    this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
    
    this.route.paramMap.subscribe((params) => {
      this.searchParam = params.get('search');
      if( params.get('province') )
        this.provinceParam = params.get('province').normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
      
      if( this.searchParam )
        // Seteo las tags según la búsqueda pasada en parámetros
        this.seoSvc.generateTags(
          'Febelink - ' + this.searchParam
          , "Buscando Servicio Profesional: " + this.searchParam
            + ( !this.provinceParam ? "" : " en Provincia: " + this.provinceParam)
        );
    });
  }

  ionViewDidEnter() {
    this.loadData();
  }
  ionViewWillLeave() {
    // Vuelvo las tags a su valor por defecto
    this.seoSvc.generateTags();
  }

  async loadData() {
    await this.getUserProfile();
    this.loadSectors();
    this.getSearchResults();
    this.loadProvinces();
    this.subsector = null;
  }

  async getSearchResults() {
    this.isLoading = true;
    this.demandasCategoria = [];
    this.searchResults = [];

    let userFavorites = await await (await this.api.getFavorites()).toPromise();
    userFavorites = Object.keys(userFavorites[0]);

    (await this.api.obtenerDemandas()).subscribe((resp) => {
      this.demandas = resp;
      for (const demanda of this.demandas) {
        if (demanda.imagen != null) {
          if (
            !demanda.imagen.includes('http://') &&
            !demanda.imagen.includes('https://')
          )
            demanda.imagen = `${environment.baseWebUrl}storage/${demanda.imagen}`;
        }

        demanda.valoracion = Number(demanda.valoracion);
        userFavorites.includes(demanda.id.toString())
          ? (demanda.favorito = true)
          : (demanda.favorito = false);
        this.demandasCategoria.push(demanda);
        this.searchResults.push(demanda);
      }
      this.isLoading = false;
    });
  }

  public detalleDemanda(demanda): void {
    this.router.navigate(['busqueda/' + demanda.id], {
      queryParams: { demanda: JSON.stringify(demanda) },
    });
  }

  sectorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.subSectors = [
      {
        id: 0,
        nombre: 'Todas',
        id_sector: 0,
      },
    ];
    this.loadSubSectors(event.value.id);
    this.subsector = this.subSectors[0];
    this.sector = event.value;
    this.filterSearchResults();
  }

  subSectorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.subsector = event.value;
    this.filterSearchResults();
  }

  provincesChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.towns = [
      {
        id: 0,
        name: 'Todas',
      },
    ];
    this.province = event.value;
    this.town = this.towns[0];
    this.loadTowns(event.value.id);
    this.filterSearchResults();
  }

  townsChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.town = event.value;
    this.filterSearchResults();
  }

  public doRefresh(refresher): void {
    this.getSearchResults();
    this.sector = this.sectors[0];
    this.subSectors = [];
    this.province = null;
    this.town = null;
    this.subsector = 'Todas';
    refresher.target.complete();
  }

  refresh() {
    this.getSearchResults();
    this.sector = this.sectors[0];
    this.subSectors = [];
    this.province = null;
    this.town = null;
    this.subsector = 'Todas';
  }

  async getUserProfile() {
    await this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
    await this.utilities.getUserData().then((data) => {
      if (data) this.currentUser = { ...data };
      if (this.currentUser) {
        this.currentUser = { ...data };
        if (this.currentUser.skip_wizard === 0 && this.isLogin === 'login') {
          // if(this.platform.is('cordova')){
          // this.openGuide();
          // }
          this.utilities.setGuia('other');
        }
      }
    });
  }

  async loadSectors() {
    this.sectors.push({ id: 0, nombre: 'Todas' });
    this.sectors = [
      ...this.sectors,
      ...(await (await this.api.obtenerSectores()).toPromise()),
    ];
    this.sector = this.sectors[0];
  }

  async loadSubSectors(id: number) {
    this.subSectors.push({ id: 0, nombre: 'Todas', id_sector: 0 });
    this.subSectors = [
      ...this.subSectors,
      ...(await (await this.api.obtenerSubSectores(id)).toPromise()),
    ];
    this.subsector = this.subSectors[0];
  }

  async loadProvinces() {
    this.provinces = [{ id: 0, name: 'Todas' }];
    this.provinces = [
      ...this.provinces,
      ...(await (await this.api.obtenerProvincias()).toPromise()),
    ];
    let hasProvinceMatch: boolean = false;
    if( this.provinceParam )
      // Si ha pasado el parametro en la url controlar si hay alguna coincidencia
      this.provinces.forEach( province => {
        let provName = province.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if( provName.indexOf( this.provinceParam ) >= 0 ) {
          this.province = province;
          hasProvinceMatch = true;
          return;
        }
      });

    // Si no hay coincidencia seleccionar la provincia: Todas
    if( !hasProvinceMatch )
      this.province = this.provinces[0];
  }

  async loadTowns(idProvincia: number) {
    this.towns = [{ id: 0, name: 'Todas' }];
    this.towns = [
      ...this.towns,
      await (await this.api.obtenerLocalidades(idProvincia)).toPromise(),
    ];
    this.town = this.towns[0];
  }

  filterSearchResults() {
    this.searchResults = [];

    if (this.province.id === 0) {
      // No Provincia
      if (this.sector.id !== 0) {
        // Si Sector
        if (this.subsector.id !== 0) {
          for (const demanda of this.demandas) {
            if (demanda.sub_sector === this.subsector.id) {
              this.searchResults.push(demanda);
            }
          }
        } else {
          for (const demanda of this.demandas) {
            if (demanda.sector === this.sector.id) {
              this.searchResults.push(demanda);
            }
          }
        }
      } else {
        // No sector
        for (const demanda of this.demandas) {
          this.demandasProvincia.push(demanda);
          this.searchResults.push(demanda);
        }
      }
    } else {
      // Si provincia
      if (this.town.id !== 0) {
        // Si localidad
        if (this.sector.id !== 0) {
          // Si sector
          const aux = this.subsector.id !== 0 ? this.subsector : this.sector;
          for (const demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              (this.subsector.id !== 0
                ? demanda.sub_sector
                : demanda.sector) === aux.id &&
              demanda.user.town_id === this.town.id
            ) {
              this.searchResults.push(demanda);
            }
          }
        } else {
          // No sector
          for (const demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (demanda.user != null && demanda.user.town_id === this.town.id) {
              this.searchResults.push(demanda);
            }
          }
        }
      } else {
        if (this.sector.id !== 0) {
          // Si sector
          const aux = this.subsector.id !== 0 ? this.subsector : this.sector;
          for (const demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              (this.subsector.id !== 0
                ? demanda.sub_sector
                : demanda.sector) === aux.id &&
              demanda.user.province_id === this.province.id
            ) {
              this.searchResults.push(demanda);
            }
          }
        } else {
          // No sector
          for (const demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              demanda.user.province_id === this.province.id
            ) {
              this.searchResults.push(demanda);
            }
          }
        }
      }
    }
  }

  public irA(p: string): void {
    if (p === '/menu/perfil') {
      if (!this.currentUser) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/menu/perfil']);
      }
    } else {
      this.router.navigate([p]);
    }
  }

  async onClickAddToFavorites(demand) {
    this.demanadaSvc.addToFavorites(demand);
  }

}
