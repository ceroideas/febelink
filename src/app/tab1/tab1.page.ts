import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ModalController, Platform } from '@ionic/angular';
import { GuidePage } from '../pages/guide/guide.page';
import { UtilitiesService } from '../services/utilities.service';
import { Router } from '@angular/router';
import { PublicarDemandaPage } from '../pages/publicar-demanda/publicar-demanda.page';
import { SesionCtrlPage } from '../pages/sesion-ctrl/sesion-ctrl.page';
import { CookiesComponent } from '../components/cookies/cookies.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  currentYear = new Date().getFullYear();
  perfil: any;
  demandas: any;
  isLoading: boolean;
  sectores: any[];
  subsectores: any[];
  subsector: any;
  sector: any;
  localidades: any[] = [];
  provincias: any[] = [];
  localidad: any;
  provincia: any;
  demandasCategoria: any = [];
  demandasProvincia: any = [];
  demandasFiltradasBuscador: any = [];
  isLogin: any;
  cookies: string;

  //SEARCH COMPONENT
  searchText: string = '';
  keyText: string = '';
  keywords: any = {};
  keys: any = [];
  openKeys: boolean = false;
  selectorEnabled: boolean = false;
  showCookies = false;
  refreshTab: any;

  constructor(
    private api: ApiService,
    private platform: Platform,
    private utilities: UtilitiesService,
    private router: Router,
    private modalCtrl: ModalController,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cookSvc: CookieService
  ) {
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
      this.obtenerPerfil();
    });

    this.utilities.getGuia().then((data) => {
      this.isLogin = data;
    });
  }

  ionViewDidEnter() {
    this.loadData();
  }

  ionViewDidLoad() {
    let searchInput = this.elementRef.nativeElement.querySelector(
      '.searchbar-input'
    );
    if (searchInput != null) {
      this.renderer.listen(searchInput, 'keyup', (event) => {
        if (event.keyCode == 13) {
          this.getSectorsByKeys({
            name: this.searchText,
            value: this.searchText,
          });
        }
      });
    }
    let searchIcon = this.elementRef.nativeElement.querySelector(
      '.searchbar-search-icon'
    );
    if (searchIcon != null) {
      this.renderer.listen(searchIcon, 'click', (event) => {
        this.getSectorsByKeys({ name: this.keyText, value: this.keyText });
      });
    }
  }

  async loadData() {
    await this.obtenerPerfil();
    this.obtenerSectores();
    this.obtenerDemandas();
    this.obtenerProvincias();
    this.subsector = null;
  }

  async obtenerDemandas() {
    this.isLoading = true;
    this.demandasCategoria = [];
    this.demandasFiltradasBuscador = [];

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
        this.demandasCategoria.push(demanda);
        this.demandasFiltradasBuscador.push(demanda);
      }
      this.isLoading = false;
    });
  }

  /**
   * Navegación a una demanda
   * @param demanda
   */
  public detalleDemanda(demanda): void {
    this.router.navigate(['demanda/' + demanda.id], {
      queryParams: { demanda: JSON.stringify(demanda) },
    });
  }

  /**
   * Filtrado con cambio de sector
   * @param event
   */
  public sectorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
    this.subsectores = [
      {
        id: 0,
        nombre: 'Todas',
      },
    ];
    this.obtenerSubSectores(event.value.id);
    this.subsector = this.subsectores[0];
    this.sector = event.value;
    this.filtrarDemandas();
  }

  /**
   * Filtrado con cambio de subsector
   * @param event
   */
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

  /**
   * Obtenemos las demandas e inicializamos los sectores de nuevo
   * @param refresher
   */
  public doRefresh(refresher): void {
    this.obtenerDemandas();
    this.sector = this.sectores[0];
    this.subsectores = [];
    this.provincia = null;
    this.localidad = null;
    this.subsector = 'Todas';
    refresher.target.complete();
  }

  refresh() {
    this.obtenerDemandas();
    this.sector = this.sectores[0];
    this.subsectores = [];
    this.provincia = null;
    this.localidad = null;
    this.subsector = 'Todas';
  }

  /**
   * Buscador automático cada tecla pulsada
   * @param event
   */
  public onKeyPressed(event): void {
    let letra = event.value.toLowerCase().trim();
    this.demandasFiltradasBuscador = this.demandasCategoria.filter(
      (demanda) =>
        demanda.nombre.toLowerCase() == letra ||
        demanda.descripcion.toLowerCase().includes(letra) ||
        demanda.nombre.toLowerCase().includes(letra)
    );
  }

  /**
   * Method to opend guide
   */
  async openGuide() {
    const guideModal = await this.modalCtrl.create({
      component: GuidePage,
      cssClass: 'guide-modal',
    });
    return await guideModal.present();
  }

  //Función para obtener los datos del perfil en el storage
  async obtenerPerfil() {
    this.cookies = this.cookSvc.get('wizard');
    if (this.cookies === 'wizard') {
      this.showCookies = false;
    } else {
      if (!this.platform.is('cordova') && this.cookies !== 'wizard') {
        this.openGuide();
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
          this.openGuide();
          //}

          this.utilities.setGuia('other');
        }
      }
    });
  }

  //Obtener sectores y subsectores
  async obtenerSectores() {
    this.sectores = [
      {
        id: 0,
        nombre: 'Todas',
      },
    ];

    (await this.api.obtenerSectores()).subscribe((sectores) => {
      for (let sector of sectores) {
        this.sectores.push(sector);
      }
      this.sector = this.sectores[0];
    });
  }

  async obtenerSubSectores(id_sector) {
    this.subsectores = [
      {
        id: 0,
        nombre: 'Todas',
      },
    ];

    (await this.api.obtenerSubSectores(id_sector)).subscribe((subsectores) => {
      for (let subsector of subsectores) {
        this.subsectores.push(subsector);
      }
      this.subsector = this.subsectores[0];
    });
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
    this.demandasFiltradasBuscador = [];

    if (this.provincia.id == 0) {
      //No Provincia
      if (this.sector.id != 0) {
        //Si Sector
        if (this.subsector.id != 0) {
          for (let demanda of this.demandas) {
            if (demanda.sub_sector == this.subsector.id) {
              this.demandasFiltradasBuscador.push(demanda);
            }
          }
        } else {
          for (let demanda of this.demandas) {
            if (demanda.sector == this.sector.id) {
              this.demandasFiltradasBuscador.push(demanda);
            }
          }
        }
      } else {
        //No sector
        for (let demanda of this.demandas) {
          this.demandasProvincia.push(demanda);
          this.demandasFiltradasBuscador.push(demanda);
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
              this.demandasFiltradasBuscador.push(demanda);
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
              this.demandasFiltradasBuscador.push(demanda);
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
              this.demandasFiltradasBuscador.push(demanda);
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
              this.demandasFiltradasBuscador.push(demanda);
            }
          }
        }
      }
    }
  }

  //NEW SEARCH COMPONENT
  addFocus() {
    this.selectorEnabled = true;
  }

  detectKeyPressed(event) {
    console.log('detecKeyPressed', event);
    if ((event.key === 'Enter') && (this.searchText.length > 2)) {
      this.publicarDemanda();
    }
  }

  async search() {
    console.log('SEARCH', this.searchText);

    if (this.searchText.length > 2) {
      (await this.api.searchByKeys(this.searchText)).subscribe((keywords) => {
        let keys = [];
        for (let key of keywords) {
          let item = { name: this.highlight(key.keyword), value: key.keyword };
          keys.push(item);
        }
        this.keys = keys;
        console.log('keywords', this.keys);
      });
    }
  }

  async getSectorsByKeys(key) {
    this.keys = [];

    (await this.api.getSectorsByKeys(key.value)).subscribe((keywords) => {
      console.log('keywords', keywords);
      this.searchText = key.value;
      this.keyText = this.searchText;
      this.keywords = keywords;
      this.selectorEnabled = true;
      this.publicarDemanda();
    });
  }

  public highlight(query) {
    if (!this.searchText) {
      return query;
    }

    return query
      .toString()
      .replace(new RegExp(this.searchText, 'gi'), (match) => {
        return '<strong>' + match + '</strong>';
      });
  }

  removeFocus() {
    console.log('REMOVE FOCUS');
    this.keyText = this.searchText;
    this.selectorEnabled = false;
  }

  clearBtn() {
    console.log('Clear buton');
    this.keywords = {};
    this.keys = [];
  }

  openOfertantes() {
    if (this.perfil !== null) {
      this.router.navigate(['ofertantes'], {
        queryParams: {
          sector: this.keywords.main.sector_id,
          sector_name: this.keywords.main.sector_nombre,
        },
      });
    } else {
      this.userRegister();
    }

    //this.removeFocus();
    this.searchText = '';
    this.keywords = {};
    this.keys = [];
  }

  /**
   * Crear modal para registro de usuario
   */
  async userRegister() {
    const registerModal = await this.modalCtrl.create({
      component: SesionCtrlPage,
    });

    await registerModal.present();
  }

  /**
   * Crear modal para publicar demanda
   */
  async publicarDemanda() {
    const publicarModal = await this.modalCtrl.create({
      component: PublicarDemandaPage,
      componentProps: { sector: this.keywords.main.sector_id },
    });

    await publicarModal.present();

    const { data } = await publicarModal.onWillDismiss();
    this.searchText = '';
    this.searchText = '';
    this.keywords = {};
    this.keys = [];
    this.loadData();
  }

  /**
   * Navegar a la pantalla p
   * @param p
   */
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

  home() {
    this.router.navigate(['menu/todas']);
  }

  async openCookies() {
    const cookiesModal = await this.modalCtrl.create({
      component: CookiesComponent,
    });

    await cookiesModal.present();
  }

  closeCookies() {
    this.showCookies = false;
  }
}
