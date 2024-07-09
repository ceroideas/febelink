import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { IonInput } from '@ionic/angular';
import { IPaginationFilter } from './../../../../models/pagination.model';
import { IUser } from './../../../../models/user.model';
import { DateFormatType } from './../../../../pipes/date-format.pipe';
import { LoadingSvc } from './../../../../services/loading.service';
import { ToastSvc } from './../../../../services/toast.service';
import { UserSessionSvc } from './../../../../services/user-session.service';
import { IAdviseFull } from '../../advises/models/advises.model';
import { IComment, ICommentFull } from '../../advises/models/comment.model';
import { CommentService } from '../../advises/services/comment.service';

@Component({
  selector: 'app-comments-component',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentsComponent implements OnInit {
  @ViewChild('inComment', { static: false }) inComment: IonInput | undefined;

  @Input() post: IAdviseFull | null = null; // Referencing Post
  @Input() iComments: ICommentFull[] = [];
  @Input() listComments: boolean = false;
  @Input() isVisible: boolean = false;
  @Output() OnCommentsVisible: EventEmitter<any> = new EventEmitter();

  dateFormatType = DateFormatType;
  iUser: IUser| null = null; 

  isLoading: boolean = false
  filter: IPaginationFilter = { activePage: 0 };

  // Comment selected
  iComment: ICommentFull| null = null; 

  // Comments done
  userComments: ICommentFull[] = [];

  constructor(
    private commentSvc: CommentService,
    private toastSvc: ToastSvc,
    public sessionSvc: UserSessionSvc,
    private loadingSvc: LoadingSvc,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sessionSvc.get().then((userData) => (this.iUser = userData));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('listComments' in changes) {
      this.listComments = changes['listComments'].currentValue;
      if (this.listComments) this.list();
    }
  }

  async list() {
    this.isLoading = true;

    // Clear user comments, since will be brought from DBs
    this.userComments = [];
//@ts-ignore
    const { response, error } = await this.commentSvc.list(
      //@ts-ignore
      this.post?.id,
      this.filter
    );
    if (error) {
      this.toastSvc.show(
        error.msg || error.message || 'There was an error geting comments',
        true
      );
      return;
    }
    this.iComments = response;
    this.isLoading = false;
  }

  async OnDoEdit(comment: ICommentFull) {
    this.iComment = comment;
    //@ts-ignore
    this.inComment.value = this.iComment?.comment || '';
    //@ts-ignore
    this.inComment.setFocus();
  }

  async OnDeleted(comment: ICommentFull) {
    // Remove from lists if is updating
    this.removeFromList(this.userComments, comment);
    this.removeFromList(this.iComments, comment);
    //@ts-ignore
    this.post.comments_qant--;
  }

  async comment(value: string | number, parentId?: number) {
    if (!value) return;
    this.loadingSvc.show();

    // Set values
    const comment: IComment = {
      id: this.iComment?.id,
      advise: this.post?.id,
      comment: value + '',
      ...(parentId && { parentId }),
    };

    const { response, error } = !this.iComment?.id
    //@ts-ignore
      ? await this.commentSvc.create(this.post?.id, comment)
      //@ts-ignore
      : await this.commentSvc.update(this.post?.id, this.iComment?.id, comment);

    if (error)
      this.toastSvc.show(
        error.msg || error.message || 'Error creating comment',
        true
      );

    // Remove from lists if is updating
    //@ts-ignore
    this.removeFromList(this.userComments, this.iComment);
    //@ts-ignore
    this.removeFromList(this.iComments, this.iComment);

    // Add new|updated item to List
    if (response) {
      this.addToList(response?.comment);
      //@ts-ignore
      this.post.comments_qant++;
    }

    this.list();

    // Clear Input
    //@ts-ignore
    this.inComment.value = '';

    // Clear selected comment to edit
    this.iComment = null;

    this.loadingSvc.dismiss();
  }

  addToList(iComment: ICommentFull) {
    // unshift = Add at the beginning of the list
    this.userComments.unshift(iComment);
  }

  removeFromList(array: ICommentFull[], iComment: ICommentFull) {
    if (!iComment) return;

    const index = array.indexOf(iComment, 0);
    if (index > -1) array.splice(index, 1);
  }

  showComments() {
    this.isVisible = true;
    this.OnCommentsVisible.emit();
  }

  childSubmit(event: { message: string | number; parentId: number }) {
    this.ref.detectChanges();
    this.comment(event?.message, event?.parentId);
  }
}
