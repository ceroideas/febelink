import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Params } from '@angular/router';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { SectorsComponent } from 'src/app/components/sectors/sectors.component';
import { UserItemComponent } from 'src/app/components/user/item/item.component';
import { UserFilterPopSvc } from 'src/app/components/user/services/user-filter.pop.service';
import { ILang } from 'src/app/models/langs.model';
import { IUser } from 'src/app/models/user.model';
import { RouteSvc } from 'src/app/services/route.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { IAdviseFull, IAdviseFilter, ITopic } from '../models/advises.model';
import { AdviseService } from '../services/advises.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-post-advises',
  templateUrl: './advises.page.html',
  styleUrls: ['./advises.page.scss'],
})
export class AdvisesPage implements OnInit {
  @ViewChild('pagination') pagination: PaginationComponent;
  @ViewChild('sectors') sectors: SectorsComponent;
  @ViewChild('lang') lang: LangBtnComponent;
  @ViewChild('user') user: UserItemComponent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  searchTx: string;
  showFilters: boolean;
  isLoading: boolean = true;

  iAdvises: IAdviseFull[] = [];
  filter: string | number;
  langSelected: ILang;
  myPosts: boolean = false;

  uid: number;
  curUser: IUser;
  activePage: number = 1;
  finishedSearch: boolean = false;

  userNickSearch: string;

  topicSelected: ITopic;
  topics = [
    { id: null, name: 'Todos' },
    { id: 1, name: 'Política' },
    { id: 2, name: 'Música' },
    { id: 3, name: 'Deportes' },
    { id: 4, name: 'Moda y Belleza' },
    { id: 5, name: 'Ocio' },
    { id: 6, name: 'Arte y Cultura' },
    { id: 7, name: 'Marketing' },
    { id: 8, name: 'Negocios' },
    { id: 9, name: 'Startups' },
    { id: 10, name: 'Tecnología' },
    { id: 11, name: 'Cine' },
    { id: 12, name: 'Naturaleza' },
    { id: 13, name: 'Ciencia' },
    { id: 14, name: 'Economía y Finanzas' },
    { id: 15, name: 'Anime y Manga' },
    { id: 16, name: 'Noticias y Actualidad' },
    { id: 17, name: 'Viajes' },
    { id: 18, name: 'Hogar y Familia' },
    { id: 19, name: 'Comida' },
    { id: 20, name: 'Videojuegos' },
    { id: 21, name: 'Salud' },
    { id: 22, name: 'Criptomonedas' },
    { id: 23, name: 'Animales' },
    { id: 24, name: 'Historia' },
  ]; // ToDo: HARDCODED! Fetch this info from DB

  constructor(
    private router: RouteSvc,
    public adviseSvc: AdviseService,
    private toastSvc: ToastSvc,
    private userFilterPop: UserFilterPopSvc,
    public sessionSvc: UserSessionSvc,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    // To refresh list on routing to this page
    this.router.addListener((url: string, params: Params) => {
      if (['posts', '/posts/oracles', 'posts/oraculos'].includes(url)) {
        this.uid = params?.uid;
      }
      this.getUser();
    });
    this.clear2search();
    this.seoService.generateTags(this.seoService.seoDEFAULT);
  }

  async getUser() {
    this.curUser = await this.sessionSvc.get();
  }

  async search(text: string | number = null) {
    console.log('buscando');
    this.filter = text != null ? text : this.filter;

    const { response, error } = await this.adviseSvc.list(
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

  clear2search(text: string | number = null, event?) {
    this.clearSearch();
    this.isLoading = true;
    this.search(text);

    if (event) {
      event.target.complete();
    }
  }

  async triggerInfiniteSearch(event) {
    await this.search();
    event.target.complete();
  }
}
