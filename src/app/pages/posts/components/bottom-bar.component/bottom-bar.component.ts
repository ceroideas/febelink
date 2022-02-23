import { FileService } from './../../../../components/file-picker/services/file.service';
import { AdviseService } from './../../advises/services/advises.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DateFormatType } from 'src/app/pipes/date-format';
import { ShareService } from 'src/app/services/share.service';
import { IAdviseFull } from '../../advises/models/advises.model';
import { IUser } from 'src/app/models/user.model';
import { UserSessionSvc } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-post-bottom-bar-component',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss'],
})
export class PostBottomBarComponent implements OnInit
{
  @Input() id: number
  @Input() post: IAdviseFull
  @Input() showChat : boolean = false
  @Input() showSeePost : boolean = false

  user: IUser
  dateFormatType = DateFormatType

  constructor(
      private router: Router
    , private adviseSvc: AdviseService
    , private shareSvc: ShareService
    , private sessionSvc: UserSessionSvc
    , private fileSvc: FileService
  ) {}

  ngOnInit() {}

  async react()
  {
    if( !( await this.sessionSvc.checkLogged() )) return

    this.post.reacted = !this.post.reacted

    // ToDo: select reaction from popover
    const reactType = 1;
    this.adviseSvc.react( this.id, reactType, this.post.reacted ? 1 : 0 )

    this.post.react_qant = ( this.post.react_qant || 0 ) + ( this.post.reacted ? 1 : -1 )
  }

  async share( ev: any )
  {
    if( await this.shareSvc.exec(
        ev
      , `posts/advise/${this.id}`
      , ( this.adviseSvc.extractTitle( this.post ) || '' ).replace(/<[^>]*>/g, '')
      , ( this.adviseSvc.extractSummary( this.post ) || '' ).replace(/<[^>]*>/g, '')
      , this.fileSvc.img2str( this.post.photo )
    )) {
      this.post.shared = ( this.post?.shared || 0 ) + 1
      this.adviseSvc.shared( this.id )
    }
  }

  async chat()
  {
    if( !( await this.sessionSvc.checkLogged() )) return
  }

  watch()
  {
    this.router.navigate([ `posts/advise/${this.id}` ]);
  }
}
