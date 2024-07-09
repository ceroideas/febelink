import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpService } from '../../../services/http.service';
import { PaginationComponent } from '../../pagination/pagination.component';
import { IUserItem } from '../models/user-item.model';
import { ToastSvc } from '../../../services/toast.service';

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
  
  @ViewChild( "pagination" ) pagination: PaginationComponent | undefined

  isLoading: boolean = false
  list: IUserItem[] | undefined
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
  
  async search(text?: any) {
    this.filter = text || text == '' ? text : this.filter

    // If Empty do not search
    if( !this.filter ) {
      this.list = undefined
      return
    }
    this.isLoading = true
    
    const { response, error } = await this.httpSvc.get(
        this.urlPath,
        { activePage: this.pagination?.activePage || 1, keys: this.filter, ...( this.params || {})}
      )

    if( error )
      this.toastSvc.show( error.message || error.message || 'common.users.error.list', true )
    
    /* List Items */
    this.list = response;

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
