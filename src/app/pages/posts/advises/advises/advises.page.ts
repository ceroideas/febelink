import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {Params} from '@angular/router';
import {LangBtnComponent} from './../../../../components/langs/btn/btn.component';
import {PaginationComponent} from './../../../../components/pagination/pagination.component';
import {SectorsComponent} from './../../../../components/sectors/sectors.component';
import {UserItemComponent} from './../../../../components/user/item/item.component';
import {UserFilterPopSvc} from './../../../../components/user/services/user-filter.pop.service';
import {ILang} from './../../../../models/langs.model';
import {IUser} from './../../../../models/user.model';
import {RouteSvc} from './../../../../services/route.service';
import {ToastSvc} from './../../../../services/toast.service';
import {UserSessionSvc} from './../../../../services/user-session.service';
import {IAdviseFull, IAdviseFilter, ITopic} from '../models/advises.model';
import {AdviseService} from '../services/advises.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {SeoService} from './../../../../services/seo.service';

const GENERAL_TITLE = 'Feed Oráculo | Febelink ¿Qué necesitas?';
const GENERAL_DESC = 'Trucos y consejos de servicios profesionales. El lugar donde compartir experiencias y soluciones';
@Component({
  selector: 'app-post-advises',
  templateUrl: './advises.page.html',
  styleUrls: ['./advises.page.scss'],
})
export class AdvisesPage implements OnInit {
  @ViewChild('pagination') pagination: PaginationComponent | null = null;
  @ViewChild('sectors') sectors: SectorsComponent| null = null
  @ViewChild('lang') lang: LangBtnComponent | null = null
  @ViewChild('user') user: UserItemComponent| null = null
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll| null = null

  searchTx: string| null = null
  showFilters: boolean = false
  isLoading: boolean = true;

  iAdvises: IAdviseFull[] = [];
  filter: string | number = "";
  langSelected: ILang| null = null
  myPosts: boolean = false;

  uid: number| null = null
  curUser: IUser| null = null
  activePage: number = 1;
  finishedSearch: boolean = false;

  userNickSearch: string | null = null

  topicSelected: ITopic | null = null
  topics = [
    {id: null, name: 'Todos'},
    {id: 1, name: 'Política'},
    {id: 2, name: 'Música'},
    {id: 3, name: 'Deportes'},
    {id: 4, name: 'Moda y Belleza'},
    {id: 5, name: 'Ocio'},
    {id: 6, name: 'Arte y Cultura'},
    {id: 7, name: 'Marketing'},
    {id: 8, name: 'Negocios'},
    {id: 9, name: 'Startups'},
    {id: 10, name: 'Tecnología'},
    {id: 11, name: 'Cine'},
    {id: 12, name: 'Naturaleza'},
    {id: 13, name: 'Ciencia'},
    {id: 14, name: 'Economía y Finanzas'},
    {id: 15, name: 'Anime y Manga'},
    {id: 16, name: 'Noticias y Actualidad'},
    {id: 17, name: 'Viajes'},
    {id: 18, name: 'Hogar y Familia'},
    {id: 19, name: 'Comida'},
    {id: 20, name: 'Videojuegos'},
    {id: 21, name: 'Salud'},
    {id: 22, name: 'Criptomonedas'},
    {id: 23, name: 'Animales'},
    {id: 24, name: 'Historia'},
  ]; // ToDo: HARDCODED! Fetch this info from DB

  constructor(
    private router: RouteSvc,
    public adviseSvc: AdviseService,
    private toastSvc: ToastSvc,
    private userFilterPop: UserFilterPopSvc,
    public sessionSvc: UserSessionSvc,
    private seoService: SeoService
  ) {
  }

  ngOnInit() {
    
    this.seoService.generateTags({title: GENERAL_TITLE, description: GENERAL_DESC});
    // To refresh list on routing to this page
    this.router.addListener((url: string, params: Params) => {
      if (['posts', '/posts/oracles', 'posts/oraculos'].includes(url)) {
        this.uid = params?.['uid'];
      }
      this.getUser();
    });
    this.clear2search();
  }

  async getUser() {
    this.curUser = await this.sessionSvc.get();
  }

  async search(text?: any) {
    this.filter = text != null ? text : this.filter;

    const {response, error} = await this.adviseSvc.list(
      await this.getFilters()
    );

    if (error) {
      this.toastSvc.show('pages.posts.advises.error.search', true);
      return;
    }

    /* List Items */
    this.iAdvises.push(...response);
    if (response?.length == 0) {
      this.finishedSearch = true;
    }

    /* Pagination Values */
    this.pagination?.update(response);

    this.isLoading = false;
  }

  async getFilters(): Promise<IAdviseFilter> {
    const filters = {
      activePage: this.activePage,
      keys: this.filter || null,

      topic: this.topicSelected?.id || null,
      sector: this.sectors?.sector || null,
      subsector: this.sectors?.subsector || null,
      lang: await this.lang?.idSelected(null),
      user: this.myPosts
        ? await this.sessionSvc.id()
        : this.uid || this.user?.user?.id || null,
      hideContent: true,

      content: this.filter,
    };
    this.activePage++;
//@ts-ignore
    return filters;
  }

  hasFilters(): boolean {
    return !(
      !this.filter &&
      !this.sectors?.sector &&
      !this.sectors?.subsector &&
      !this.user?.user
    );
  }

  async createPost() {
    if (await this.sessionSvc.checkLogged()) {
      this.router.navigate(['posts/oracle/create']);
    } else {
      this.router.navigate(['registro']);
    }
  }

  async userClicked() {
    const user = await this.userFilterPop.show('posts/oracles/users');
//@ts-ignore

    this.user.user = user;
    this.userNickSearch = user.nick;
    this.clear2search();
  }

  /* Pagination */

  /*async infiniteScroll(event) {
    await this.search();
    event.target.complete();
  }*/

  clearSearch() {
    this.activePage = 1;
    this.finishedSearch = false;
    this.iAdvises = [];
  }
//@ts-ignore

  clear2search(text: string | number = null, event?) {
    this.clearSearch();
    this.isLoading = true;
    this.search(text);

    if (event) {
      event.target.complete();
    }
  }

  async triggerInfiniteSearch(event: any) {
    await this.search();
    event.target.complete();
  }
}
