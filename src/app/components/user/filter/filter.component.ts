import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { PaginationComponent } from '../../pagination/pagination.component';
import { IUserItem } from '../models/user-item.model';

@Component({
  selector: 'app-user-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class UserFilterComponent implements OnInit {

  @Input() urlPath: string = 'admin/getUsersByKey'
  @Input() searchTx: string = ''
  @Input() params: any
  @Output() OnUserSelectd: EventEmitter<IUserItem> = new EventEmitter()
  
  @ViewChild( "pagination" ) pagination: PaginationComponent

  isLoading: boolean = false
  list: IUserItem[] = []
  filter: string = ''

  constructor(
      private httpSvc: HttpService
    , private modalCtrl: ModalController
    , private toastSvc: ToastSvc
  ) {}

  ngOnInit() {}

  dismiss( iUser?: IUserItem )
  {
    this.modalCtrl.dismiss({ iUser })
  }
  
  async search( text?: string )
  {
    this.isLoading = true
    this.filter = text || this.filter

    const { response, error } = await ( await this.httpSvc.get(
        this.urlPath,
        { activePage: this.pagination?.activePage || 1, keys: this.filter, ...( this.params || {})}
      )).toPromise()

    if( error ) {
      this.toastSvc.show( error.message || error.message || 'common.users.error.list', true )
      return
    }
    
    /* List Items */
    this.list = response.items;

    /* Pagination Values */
    this.pagination?.update( response )

    this.isLoading = false
  }

  userSelected( user: IUserItem )
  {
    if( this.OnUserSelectd ) this.OnUserSelectd.emit( user )
    this.dismiss( user )
  }

  /* Pagination */
  displayActivePage()
  {
    this.search();
  }
}
