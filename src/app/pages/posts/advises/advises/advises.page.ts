import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { SectorsComponent } from 'src/app/components/sectors/sectors.component';
import { UserItemComponent } from 'src/app/components/user/item/item.component';
import { UserFilterPopSvc } from 'src/app/components/user/services/user-filter.pop.service';
import { ILang } from 'src/app/models/langs.model';
import { IUser } from 'src/app/models/user.model';
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

  iAdvises: IAdviseFull[]
  filter: string | number
  langSelected: ILang
  
  curUser: IUser

  constructor(
      private router: Router
    , private adviseSvc: AdviseService
    , private toastSvc: ToastSvc
    , private userFilterPop: UserFilterPopSvc
    , public sessionSvc: UserSessionSvc
  ) {}

  ngOnInit()
  {
    // To refresh list on routing to this page
    this.router.events.pipe(
      filter((events: RouterEvent) => events instanceof NavigationEnd),
    ).subscribe((val) => {
      if ([ 'posts', '/posts/advises', 'posts/consejos' ].includes( val.url ))
        this.search();
    });
  }

  async ngAfterViewInit()
  {
    this.search()
    this.curUser = await this.sessionSvc.get()
  }

  async search( text: string | number = null )
  {
    this.isLoading = true
    this.filter = text != null ? text : this.filter

    const { response, error } = await this.adviseSvc.list( await this.getFilters() )

    if( error ) {
      this.toastSvc.show( 'pages.posts.advises.error.search', true )
      return
    }
    
    /* List Items */
    this.iAdvises = response

    /* Pagination Values */
    this.pagination?.update( response )

    this.isLoading = false
  }

  async getFilters(): Promise<IAdviseFilter>
  {
    const filters = {
        activePage: this.pagination?.activePage || 0
      , keys: this.filter || null
      
      , sector: this.sectors?.sector || null
      , subsector: this.sectors?.subsector || null
      , lang: await this.lang?.id()
      , user: this.user?.user?.id || null
    }
    return filters;
  }
  hasFilters(): boolean {
    return !( this.sectors.sector && !this.sectors.subsector && !this.user?.user )
  }

  async createPost()
  {
    if( await this.sessionSvc.checkLogged() )
      this.router.navigate([ 'posts/advise/create' ]);
  }

  async userClicked()
  {
    this.userFilterPop.show( 'posts/advises/users', await this.getFilters())
  }

  

  /* Pagination */
  displayActivePage(){
    this.search();
  }
}
