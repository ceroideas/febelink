import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import {IOptsMenuButton} from '../../../../components/opts-menu/models/opts-menu.model';
import {OptsMenuSvc} from '../../../../components/opts-menu/services/opts-menu.service';
import {IReport} from '../../../../models/report.model';
import {DateFormatType} from '../../../../pipes/date-format.pipe';
import {AlertSvc, IAlert} from '../../../../services/alert.service';
import {LoadingSvc} from '../../../../services/loading.service';
import {ReportService} from '../../../../services/report.service';
import {ToastSvc} from '../../../../services/toast.service';
import {UserSessionSvc} from '../../../../services/user-session.service';
import {ICommentFull} from '../../advises/models/comment.model';
import {CommentService} from '../../advises/services/comment.service';

@Component({
  selector: 'app-comment-component',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentComponent implements OnInit {
  //@ts-ignore
  @Input() post: number; // Referencing Post Id
  //@ts-ignore
  @Input() iComment: ICommentFull;
  @Output() OnDoEdit: EventEmitter<ICommentFull> = new EventEmitter();
  @Output() OnDeleted: EventEmitter<ICommentFull> = new EventEmitter();
  @Output() childSubmit: EventEmitter<{
    message: string | number;
    parentId: number;
  }> = new EventEmitter();

  dateFormatType = DateFormatType;
  indexShowReply: any;

  constructor(
    private optsMenuSvc: OptsMenuSvc,
    private commentSvc: CommentService,
    private sessionSvc: UserSessionSvc,
    private alertSvc: AlertSvc,
    private toastSvc: ToastSvc,
    private loadingSvc: LoadingSvc,
    private reportSvc: ReportService
  ) {
  }

  ngOnInit() {
    console.log(this.iComment)
  }

  /* ngOnChanges( changes: SimpleChanges ): void {
    if ( 'iAdvise' in changes) {
      this.iAdvise = changes.iAdvise.currentValue
    }
  } */

  async options(event:any) {
    let opts: IOptsMenuButton[];

    if (await this.sessionSvc.isUser(this.iComment?.uid))
      opts = [
        {
          text: 'common.buttons.edit',
          click: (iOptsMenuButton: IOptsMenuButton) => this.edit(),
        } as IOptsMenuButton,
        {
          text: 'common.buttons.delete',
          click: (iOptsMenuButton: IOptsMenuButton) => this.delete(),
        } as IOptsMenuButton,
      ];
    else
      opts = [
        {
          text: 'common.buttons.report',
          click: (iOptsMenuButton: IOptsMenuButton) => this.report(),
        } as IOptsMenuButton,
      ];

    this.optsMenuSvc.show(event, opts);
  }

  async edit() {
    this.OnDoEdit?.emit(this.iComment);
  }

  async delete() {
    if (
      await this.alertSvc.confirm({
        title: 'pages.posts.comment.delete.title',
        msg: 'pages.posts.comment.delete.msg',
      } as IAlert)
    ) {
      await this.loadingSvc.show();
      const {response, error} = await this.commentSvc.delete(
        this.post,
        //@ts-ignore
        this.iComment?.id
      );
      await this.loadingSvc.dismiss();

      if (error) {
        this.toastSvc.show(
          error.msg || error.message || 'Error on deleting',
          true
        );
        return;
      }

      // Inform item deleted
      this.OnDeleted.emit(this.iComment);

      this.toastSvc.show(response.message, true);
    }
  }

  report() {
    this.reportSvc.show({
      comment: this.iComment?.id,
    } as IReport);
  }

  comment(message: any) {
    //@ts-ignore
    this.childSubmit.emit({message, parentId: this.iComment?.id});
  }

  showReply(index: any) {
    this.indexShowReply = "";
    this.indexShowReply = index;
  }

  share(event:any) {
  }
}
