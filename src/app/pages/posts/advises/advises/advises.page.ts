import { Component, OnInit, ViewChild } from '@angular/core';
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
import { IAdviseFull, IAdviseFilter } from '../models/advises.model';
import { AdviseService } from '../services/advises.service';

@Component({
  selector: 'app-post-advises',
  templateUrl: './advises.page.html',
  styleUrls: ['./advises.page.scss'],
})
export class AdvisesPage implements OnInit
{
  @ViewChild( "pagination" ) pagination: PaginationComponent
  @ViewChild( "sectors" ) sectors: SectorsComponent
  @ViewChild( "lang" ) lang: LangBtnComponent
  @ViewChild( "user" ) user: UserItemComponent

  searchTx: string
  showFilters: boolean
  isLoading: boolean = true

  iAdvises: IAdviseFull[] = []
  filter: string | number
  langSelected: ILang
  myPosts: boolean = false
  
  uid: number
  curUser: IUser
  activePage: number = 1
  finishedSearch: boolean = false

  constructor(
      private router: RouteSvc
    , private adviseSvc: AdviseService
    , private toastSvc: ToastSvc
    , private userFilterPop: UserFilterPopSvc
    , public sessionSvc: UserSessionSvc
  ) {}

  ngOnInit()
  {
    // To refresh list on routing to this page
    this.router.addListener(( url: string, params: Params ) => {
      if ([ 'posts', '/menu/oracles', 'menu/oraculos' ].includes( url )) {
        this.uid = params?.uid
        this.search();
      }
    })
  }

  async ngAfterViewInit()
  {
    this.curUser = await this.sessionSvc.get()
  }

  async search( text: string | number = null )
  {
    this.filter = text != null ? text : this.filter

    const { response, error } = await this.adviseSvc.list( await this.getFilters() )

    if( error ) {
      this.toastSvc.show( 'pages.posts.advises.error.search', true )
      return
    }
    
    /* List Items */
    this.iAdvises.push( ...response )
    if( response?.length == 0 ) this.finishedSearch = true

    /* Pagination Values */
    this.pagination?.update( response )

    this.isLoading = false
  }

  async getFilters(): Promise<IAdviseFilter>
  {
    const filters = {
        activePage: this.activePage
      , keys: this.filter || null
      
      , sector: this.sectors?.sector || null
      , subsector: this.sectors?.subsector || null
      , lang: await this.lang?.id()
      , user: this.myPosts ? await this.sessionSvc.id() : this.uid || this.user?.user?.id || null
    }
    this.activePage++

    return filters
  }
  hasFilters(): boolean {
    return !( !this.filter && !this.sectors.sector && !this.sectors.subsector && !this.user?.user )
  }

  async createPost()
  {
    if( await this.sessionSvc.checkLogged() )
      this.router.navigate([ 'posts/oracle/create' ]);
  }

  async userClicked()
  {
    const user = await this.userFilterPop.show( 'posts/oracles/users' )
    this.user.user = user
    this.search()
  }

  

  /* Pagination */
  async infiniteScroll( event )
  {
    await this.search()
    event.target.complete();
  }

  clearSearch()
  {
    this.activePage = 1
    this.finishedSearch = false
    this.iAdvises = []
  }
  clear2search( text: string | number = null )
  {
    this.clearSearch()
    this.isLoading = true
    this.search( text )
  }
}
