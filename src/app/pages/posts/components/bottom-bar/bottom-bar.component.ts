import { FileService } from '../../../../components/file-picker/services/file.service';
import { AdviseService } from '../../advises/services/advises.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DateFormatType } from 'src/app/pipes/date-format.pipe';
import { ShareService } from 'src/app/services/share.service';
import { IAdviseFull } from '../../advises/models/advises.model';
import { IUser } from 'src/app/models/user.model';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { ICommentFull } from '../../advises/models/comment.model';
import { ReactTypePopSvc } from '../services/react-type.pop.service';
import { IReactTypes, Reacts } from '../models/react-types.model';

@Component({
  selector: 'app-post-bottom-bar-component',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss'],
})
export class PostBottomBarComponent implements OnInit {
  @Input() id: number;
  @Input() post: IAdviseFull;
  @Input() comment: ICommentFull;
  @Input() showChat: boolean = false;
  @Input() showSeePost: boolean = false;

  user: IUser;
  dateFormatType = DateFormatType;
  reacts = Reacts;

  constructor(
    private router: Router,
    private adviseSvc: AdviseService,
    private shareSvc: ShareService,
    private sessionSvc: UserSessionSvc,
    private fileSvc: FileService,
    private reacTypeSvc: ReactTypePopSvc
  ) {}

  ngOnInit() {
    this.sessionSvc.get().then((userData) => (this.user = userData));
  }

  async react(ev: any) {
    if (!(await this.sessionSvc.checkLogged())) {
      this.router.navigate(['registro']);
      return;
    }

    // ToDo: select reaction from popover
    const reactType: IReactTypes = await this.reacTypeSvc.show(ev);

    // No reaction selected || Same reaction selected
    if (!reactType || reactType?.id == this.post.reacted) return;

    // Add or Substract only if is not a positive reaction after a positive reaction
    const reaction =
      reactType?.id + this.post.reacted > 1 ? 0 : reactType?.id < 1 ? -1 : +1;

    this.post.reacted = reactType.id;
    this.post.react_qant = (this.post.react_qant || 0) + reaction;

    this.adviseSvc.react(this.id, reactType?.id, this.post.reacted ? 1 : 0);
  }

  async share(ev: any) {
    if (
      await this.shareSvc.exec(
        ev,
        `posts/oracle/${this.id}`,
        (this.adviseSvc.extractTitle(this.post) || '').replace(/<[^>]*>/g, ''),
        (this.adviseSvc.extractSummary(this.post) || '').replace(
          /<[^>]*>/g,
          ''
        ),
        this.fileSvc.img2str(this.post?.media_url),
        this.post?.content || this.post.title ? this.id : null
      )
    ) {
      this.post.shared = (this.post?.shared || 0) + 1;
      this.adviseSvc.shared(this.id);
    }
  }

  async chat() {
    if (!(await this.sessionSvc.checkLogged())) return;
  }

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedString;
  }
  watch() {
    let searchText = ''
    let lower
    if ( this.post.title == null || this.post.title == undefined || this.post.title == '' ) {
    }else{
      searchText = this.post.title.replace(new RegExp(' ', 'g'), '-');
      searchText= this.removeAccents(searchText)

      lower = searchText.toLowerCase();
    }
   
    this.router.navigate([`posts/oracle/${this.id}/${lower}`]);
  }
}
