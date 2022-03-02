import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { IPaginationFilter } from 'src/app/models/pagination.model';
import { IUser } from 'src/app/models/user.model';
import { DateFormatType } from 'src/app/pipes/date-format.pipe';
import { LoadingSvc } from 'src/app/services/loading.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { ICommentFull } from '../../advises/models/comment.model';
import { CommentService } from '../../advises/services/comment.service';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-comments-component',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentsComponent implements OnInit {

  @ViewChild( 'inComment', { static: false }) inComment: IonInput;

  @Input() post: number // Referencing Post Id
  @Input() iComments: ICommentFull[] = []
  @Input() listComments: boolean = false
  @Input() isVisible: boolean = false
  @Output() OnCommentsVisible: EventEmitter<any> = new EventEmitter();
  
  dateFormatType = DateFormatType
  iUser: IUser
  
  isLoading: boolean = false
  filter: IPaginationFilter = { activePage: 0 }
  
  // Comment selected
  iComment: ICommentFull

  // Comments done
  userComments: ICommentFull[] = []

  constructor(
      private commentSvc: CommentService
    , private toastSvc: ToastSvc
    , public sessionSvc: UserSessionSvc
    , private loadingSvc: LoadingSvc
  ) {}

  ngOnInit()
  {
    this.sessionSvc.get().then(( userData ) => this.iUser = userData )
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( 'listComments' in changes ) {
      this.listComments = changes.listComments.currentValue
      if( this.listComments ) this.list() 
    }
  }

  async list()
  {
    this.isLoading = true

    // Clear user comments, since will be brought from DBs
    this.userComments = []

    const { response, error } = await this.commentSvc.list( this.post, this.filter )
    if( error ) {
      this.toastSvc.show( error.msg || error.message || 'There was an error geting comments', true )
      return
    }
    console.log({ response, error })
    this.iComments = response
    this.isLoading = false
  }

  async OnDoEdit( comment: ICommentFull )
  {
    this.iComment = comment
    this.inComment.value = this.iComment?.comment || ''
    this.inComment.setFocus()
  }

  async OnDeleted( comment: ICommentFull )
  {
    // Remove from lists if is updating 
    this.removeFromList( this.userComments, comment )
    this.removeFromList( this.iComments, comment )
  }

  async comment( value: string | number )
  {
    if( !value ) return
    this.loadingSvc.show()

    // Set values
    const comment = {
        id: this.iComment?.id
      , advise: this.post
      , comment: value + ''
      , id_comment: this.iComment?.id_comment
    }

    const { response, error } = !this.iComment?.id
        ? await this.commentSvc.create( this.post, comment )
        : await this.commentSvc.update( this.post, this.iComment?.id, comment )

    console.log({ response, error })
    if( error ) this.toastSvc.show( error.msg || error.message || 'Error creating comment', true )

    // Remove from lists if is updating 
    this.removeFromList( this.userComments, this.iComment )
    this.removeFromList( this.iComments, this.iComment )

    // Add new|updated item to List
    if( response ) this.addToList( response?.comment )

    // Clear Input
    this.inComment.value = '';

    // Clear selected comment to edit
    this.iComment = null

    this.loadingSvc.dismiss()
  }

  addToList( iComment: ICommentFull )
  {
    // unshift = Add at the beginning of the list
    this.userComments.unshift( iComment )
  }

  removeFromList( array: ICommentFull[], iComment: ICommentFull )
  {
    if( !iComment ) return

    const index = array.indexOf( iComment, 0 );
    if (index > -1) array.splice(index, 1)
  }

  showComments()
  {
    this.isVisible = true
    this.OnCommentsVisible.emit()
  }
}
