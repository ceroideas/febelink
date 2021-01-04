import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GuidePage } from '../pages/guide/guide.page';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ISearch } from '../models/search.model';
import { ISector, ISubSector } from '../models/sector.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  currentYear = new Date().getFullYear();
  perfil: any;
  demandas: any;
  isLoading: boolean;
  sectors: ISector[] = [];
  subSectors: ISubSector[] = [];
  subsector: any;
  sector: any;
  localidades: any[] = [];
  provincias: any[] = [];
  localidad: any;
  provincia: any;
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
    private modalCtrl: ModalController,
  ) {
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
      this.obtenerPerfil();
    });

    this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadData();
  }

  async loadData() {
    await this.obtenerPerfil();
    this.loadSectors();
    this.obtenerDemandas();
    this.obtenerProvincias();
    this.subsector = null;
  }

  async obtenerDemandas() {
    this.isLoading = true;
    this.demandasCategoria = [];
    this.searchResults = [];

    (await this.api.obtenerDemandas()).subscribe((resp) => {
      this.demandas = resp;
      for (let demanda of this.demandas) {
        if (demanda.imagen != null) {
          if (
            !demanda.imagen.includes('http://') &&
            !demanda.imagen.includes('https://')
          )
            demanda.imagen =
              'https://api.febelink.com/storage/' + demanda.imagen;
        }

        demanda.valoracion = Number(demanda.valoracion);
        demanda.favorito = false;
        this.demandasCategoria.push(demanda);
        this.searchResults.push(demanda);
      }
      this.isLoading = false;
      console.log('searchResults', this.searchResults);
    });
  }

  public detalleDemanda(demanda): void {
    this.router.navigate(['demanda/' + demanda.id], {
      queryParams: { demanda: JSON.stringify(demanda) },
    });
  }

  public sectorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.subSectors = [
      {
        id: 0,
        nombre: 'Todas',
        id_sector: 0
      },
    ];
    this.loadSubSectors(event.value.id);
    this.subsector = this.subSectors[0];
    this.sector = event.value;
    this.filtrarDemandas();
  }

  public subSectorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.subsector = event.value;
    this.filtrarDemandas();
  }

  public provinciasChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.localidades = [
      {
        id: 0,
        name: 'Todas',
      },
    ];
    this.provincia = event.value;
    this.localidad = this.localidades[0];
    this.obtenerLocalidades(event.value.id);
    this.filtrarDemandas();
  }

  public localidadesChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.localidad = event.value;
    this.filtrarDemandas();
  }

  public doRefresh(refresher): void {
    this.obtenerDemandas();
    this.sector = this.sectors[0];
    this.subSectors = [];
    this.provincia = null;
    this.localidad = null;
    this.subsector = 'Todas';
    refresher.target.complete();
  }

  refresh() {
    this.obtenerDemandas();
    this.sector = this.sectors[0];
    this.subSectors = [];
    this.provincia = null;
    this.localidad = null;
    this.subsector = 'Todas';
  }

  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }

  async obtenerPerfil() {

    await this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });

    await this.utilities.getUserData().then((data) => {
      this.perfil = data;

      if (this.perfil !== null) {
        if (this.perfil.skip_wizard === 0 && this.isLogin === 'login') {
          //if(this.platform.is('cordova')){
          this.openGuide();
          //}

          this.utilities.setGuia('other');
        }
      }
    });
  }

  async loadSectors() {
    this.sectors.push({ id: 0, nombre: 'Todas' });
    this.sectors = [
      ...this.sectors,
      ...await (await this.api.obtenerSectores()).toPromise()
    ];
    this.sector = this.sectors[0];
  }

  async loadSubSectors(id: number) {
    this.subSectors.push({ id: 0, nombre: 'Todas', id_sector: 0});

    this.subSectors = [
      ...this.subSectors,
      ...await (await this.api.obtenerSubSectores(id)).toPromise()
    ];

    console.log('subsectors', this.subSectors);
    this.subsector = this.subSectors[0];
  }

  async obtenerProvincias() {
    this.provincias = [
      {
        id: 0,
        name: 'Todas',
      },
    ];

    (await this.api.obtenerProvincias()).subscribe((provincias) => {
      for (let provincia of provincias) {
        this.provincias.push(provincia);
      }
      this.provincia = this.provincias[0];
    });
  }

  async obtenerLocalidades(id_provincia) {
    this.localidades = [
      {
        id: 0,
        name: 'Todas',
      },
    ];

    (await this.api.obtenerLocalidades(id_provincia)).subscribe(
      (localidades) => {
        for (let localidad of localidades) {
          this.localidades.push(localidad);
        }
        this.localidad = this.localidades[0];
      }
    );
  }

  filtrarDemandas() {
    this.searchResults = [];

    if (this.provincia.id == 0) {
      //No Provincia
      if (this.sector.id != 0) {
        //Si Sector
        if (this.subsector.id != 0) {
          for (let demanda of this.demandas) {
            if (demanda.sub_sector == this.subsector.id) {
              this.searchResults.push(demanda);
            }
          }
        } else {
          for (let demanda of this.demandas) {
            if (demanda.sector == this.sector.id) {
              this.searchResults.push(demanda);
            }
          }
        }
      } else {
        //No sector
        for (let demanda of this.demandas) {
          this.demandasProvincia.push(demanda);
          this.searchResults.push(demanda);
        }
      }
    } else {
      //Si provincia
      if (this.localidad.id != 0) {
        //Si localidad
        if (this.sector.id != 0) {
          //Si sector
          let aux = this.subsector.id != 0 ? this.subsector : this.sector;
          for (let demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              (this.subsector.id != 0 ? demanda.sub_sector : demanda.sector) ==
                aux.id &&
              demanda.user.town_id == this.localidad.id
            ) {
              this.searchResults.push(demanda);
            }
          }
        } else {
          //No sector
          for (let demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              demanda.user.town_id == this.localidad.id
            ) {
              this.searchResults.push(demanda);
            }
          }
        }
      } else {
        if (this.sector.id != 0) {
          //Si sector
          let aux = this.subsector.id != 0 ? this.subsector : this.sector;
          for (let demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              (this.subsector.id != 0 ? demanda.sub_sector : demanda.sector) ==
                aux.id &&
              demanda.user.province_id == this.provincia.id
            ) {
              this.searchResults.push(demanda);
            }
          }
        } else {
          //No sector
          for (let demanda of this.demandas) {
            this.demandasProvincia.push(demanda);
            if (
              demanda.user != null &&
              demanda.user.province_id == this.provincia.id
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
      if (this.perfil === null) {
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['/menu/perfil']);
      }
    } else {
      this.router.navigate([p]);
    }
  }

  onClickAddToFavorites() {
    console.log('onClickFavourite');
  }

  }
