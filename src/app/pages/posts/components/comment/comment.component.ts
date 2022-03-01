import { Component, OnInit, Input, SimpleChanges, ViewEncapsulation, Output, EventEmitter  } from '@angular/core';
import { IOptsMenuButton } from 'src/app/components/opts-menu/models/opts-menu.model';
import { OptsMenuSvc } from 'src/app/components/opts-menu/services/opts-menu.service';
import { IReport } from 'src/app/models/report.model';
import { DateFormatType } from 'src/app/pipes/date-format.pipe';
import { AlertSvc, IAlert } from 'src/app/services/alert.service';
import { LoadingSvc } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { ICommentFull } from '../../advises/models/comment.model';
import { CommentService } from '../../advises/services/comment.service';

@Component({
  selector: 'app-comment-component',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentComponent implements OnInit {

  @Input() post: number // Referencing Post Id
  @Input() iComment: ICommentFull
  @Output() OnUpdate:
      EventEmitter<{ comment: ICommentFull, component: CommentComponent }> = new EventEmitter();
  
  dateFormatType = DateFormatType

  constructor(
      private optsMenuSvc: OptsMenuSvc
    , private commentSvc: CommentService
    , private sessionSvc: UserSessionSvc
    , private alertSvc: AlertSvc
    , private toastSvc: ToastSvc
    , private loadingSvc: LoadingSvc
    , private reportSvc: ReportService
  ) { }

  ngOnInit() {}

  /* ngOnChanges( changes: SimpleChanges ): void {
    if ( 'iAdvise' in changes) {
      this.iAdvise = changes.iAdvise.currentValue
    }
  } */

  async options( event )
  {
    let opts: IOptsMenuButton[]
    
    if( await this.sessionSvc.isUser( this.iComment?.uid ))
      opts = [
        {
          text: 'common.buttons.edit'
          , click: ( iOptsMenuButton: IOptsMenuButton ) => this.edit()
        } as IOptsMenuButton
        , {
            text: 'common.buttons.delete'
          , click: ( iOptsMenuButton: IOptsMenuButton ) => this.delete()
        } as IOptsMenuButton
      ]
    else
      opts = [
        {
          text: 'common.buttons.report'
          , click: ( iOptsMenuButton: IOptsMenuButton ) => this.report()
        } as IOptsMenuButton
      ]
    
    this.optsMenuSvc.show( event, opts )
  }

  async edit()
  {
    this.toastSvc.show( 'common.developing', true )
    // ToDo
    // this.router.navigate([ `posts/oracle/${this.id}/edit` ])
  }

  async delete()
  {
    if( await this.alertSvc.confirm({
        title: 'pages.posts.advises.delete.title'
      , msg: 'pages.posts.advises.delete.msg'
    } as IAlert )) {
      this.loadingSvc.show()
      const { response, error } = await this.commentSvc.delete( this.iComment?.id )
      this.loadingSvc.dismiss()

      if( error ) {
        this.toastSvc.show( error.msg || error.message || 'Error on deleting', true )
        return
      }

      this.toastSvc.show( response.message, true )
    }
  }

  report()
  {
    this.reportSvc.show({
      comment: this.iComment?.id
    } as IReport )
  }

  async update( comment: string )
  {
    if( ( comment || '').length < 4 ) {
      this.toastSvc.show( 'El comentario es muy corto', true )
      return
    }

    this.iComment.comment = comment

    const { response, error } = !this.iComment.id
      ? await this.commentSvc.create( this.iComment )
      : await this.commentSvc.update( this.iComment.id, this.iComment )
  }
}
