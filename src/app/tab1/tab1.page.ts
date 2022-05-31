import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Platform } from '@ionic/angular';
import { UtilitiesService } from '../services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { answerOptions } from 'src/utils/utils';
import { IUser } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { AssistantSearchComponent } from './assistant/components/search/search.component';
import { AssistantPopSvc } from './assistant/services/assistant.pop.service';
import { AssistantSearchSvc } from './assistant/services/assistant-search.service';
import { IKeywords } from './assistant/models/assistant.model';
import { SubsectorService } from '../components/sectors/services/subsectores.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  currentYear = new Date().getFullYear();
  perfil: IUser = null;
  isLoading: boolean;
  isLogin: any;
  cookies: string;
  filter_hidden: boolean;

  //SEARCH COMPONENT
  @ViewChild('search') searchComponent: AssistantSearchComponent;
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

  constructor(
    private api: ApiService,
    public platform: Platform,
    private utilities: UtilitiesService,
    private router: Router,
    private cookSvc: CookieService,
    private activatedRoute: ActivatedRoute,
    private assistantPop: AssistantPopSvc,
    public assistantSearchSvc: AssistantSearchSvc,
    private subsectorSvc: SubsectorService
  ) {
    this.refreshTab = this.api.getUserLogged().subscribe((item) => {
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
      this.searchComponent.text(searchbar);
    }
  }

  ionViewDidEnter() {
    this.loadData();
    this.recomendation();
  }

  ionViewDidLeave() {
    this.showCard = false;
    this.searchComponent.clear();
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
    if (this.isLoading && this.searchComponent.text())
      this.searchComponent.getSectorsByKeys();
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
    this.assistantPop.show(this.perfil, this.searchComponent.get());
    this.searchComponent.clear();
  }

  OnEnter() {
    this.assistantPop.show(this.perfil, this.searchComponent.get());
    this.searchComponent.clear();
  }

  async openCookies() {
    this.navegar('cookie-policy');
  }

  closeCookies() {
    this.showCookies = false;
  }

  public navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

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
}
