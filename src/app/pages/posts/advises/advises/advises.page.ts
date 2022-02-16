import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { SectorsComponent } from 'src/app/components/sectors/sectors.component';
import { UserItemComponent } from 'src/app/components/user/item/item.component';
import { UserFilterPopSvc } from 'src/app/components/user/services/user-filter.pop.service';
import { ILang } from 'src/app/models/langs.model';
import { ISector, ISubSector } from 'src/app/models/sector.model';
import { ToastSvc } from 'src/app/services/toast.service';
import { IAdvise, IAdviseFilter } from '../models/advises.model';
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

  iAdvises: IAdvise[]
  filter: string
  

  constructor(
      private router: Router
    , private adviseSvc: AdviseService
    , private toastSvc: ToastSvc
    , private userFilterPop: UserFilterPopSvc
  ) {}

  ngOnInit() {}

  async search( text?: string ) {
    this.isLoading = true
    this.filter = text || this.filter

    const { response, error } = await this.adviseSvc.list( this.getFilters() )

    if( error ) {
      this.toastSvc.show( 'pages.posts.advises.error.search', true )
      return
    }
    
    /* List Items */
    this.iAdvises = response.items

    /* Pagination Values */
    this.pagination.update( response )

    this.isLoading = false
  }

  getFilters(): IAdviseFilter
  {
    return {
        activePage: this.pagination.activePage
      , keys: this.filter
      
      , sector: this.sectors?.sector?.id
      , subsector: this.sectors?.subsector?.id
      , lang: this.lang?.langSelected?.id || 1
      , user: this.user?.user?.id
    }
  }
  hasFilters(): boolean {
    return !( this.sectors.sector && !this.sectors.subsector && !this.user?.user )
  }

  createPost()
  {
    this.router.navigate(['posts/advise/create' ]);
  }

  userClicked()
  {
    this.userFilterPop.show( 'posts/advises/users', this.getFilters())
  }

  

  /* Pagination */
  displayActivePage(){
    this.search();
  }
}
