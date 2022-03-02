import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { IPaginationFilter } from 'src/app/models/pagination.model';
import { DateFormatType } from 'src/app/pipes/date-format.pipe';
import { ToastSvc } from 'src/app/services/toast.service';
import { ICommentFull } from '../../advises/models/comment.model';
import { CommentService } from '../../advises/services/comment.service';

@Component({
  selector: 'app-comments-component',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentsComponent implements OnInit {

  @Input() post: number // Referencing Post Id
  @Input() iComments: ICommentFull[]
  @Input() isVisible: boolean = false
  
  dateFormatType = DateFormatType

  isLoading: boolean
  filter: IPaginationFilter = { activePage: 0 }

  constructor(
      private commentSvc: CommentService
    , private toastSvc: ToastSvc
  ) {}

  ngOnInit() {}

  ngOnChanges( changes: SimpleChanges ): void {
    console.log({ changes, length: this.iComments?.length })
    if ( 'isVisible' in changes ) {
      this.isVisible = changes.isVisible.currentValue

      if( this.isVisible && !this.iComments ) this.list() 
    }
  }

  async list()
  {
    this.isLoading = true

    const { response, error } = await this.commentSvc.list( this.post, this.filter )
    if( error ) {
      this.toastSvc.show( error.msg || error.message || 'There was an error geting comments', true )
      return
    }

    this.iComments = response
    this.isLoading = false
  }

  add( iComment: ICommentFull )
  {
    // unshift = Add comment at the beginning of the list
    this.iComments.unshift( iComment )
  }

  async update( event )
  {
    console.log({ event })
    /* if( ( comment || '').length < 4 ) {
      this.toastSvc.show( 'El comentario es muy corto', true )
      return
    }

    this.iComment.comment = comment

    const { response, error } = !this.iComment.id
      ? await this.commentSvc.create( this.iComment )
      : await this.commentSvc.update( this.iComment.id, this.iComment ) */
  }
}
