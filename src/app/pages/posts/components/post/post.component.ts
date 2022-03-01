import { Component, OnInit, Input, SimpleChanges, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/components/file-picker/services/file.service';
import { IOptsMenuButton } from 'src/app/components/opts-menu/models/opts-menu.model';
import { OptsMenuSvc } from 'src/app/components/opts-menu/services/opts-menu.service';
import { IReport } from 'src/app/models/report.model';
import { DateFormatType } from 'src/app/pipes/date-format.pipe';
import { AlertSvc, IAlert } from 'src/app/services/alert.service';
import { LoadingSvc } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';
import { SeoService } from 'src/app/services/seo.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { IAdviseFull } from '../../advises/models/advises.model';
import { ICommentFull } from '../../advises/models/comment.model';
import { AdviseService } from '../../advises/services/advises.service';

@Component({
  selector: 'app-post-component',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit {

  @Input() id: number
  @Input() iAdvise: IAdviseFull
  @Input() showLang: boolean = false
  @Input() showOpts: boolean = false
  @Input() showSeePost: boolean = false
  @Input() showContent: boolean = false
  @Input() showCommentInput: boolean = true
  @Input() comments: ICommentFull[]

  dateFormatType = DateFormatType

  constructor(
      private optsMenuSvc: OptsMenuSvc
    , private adviseSvc: AdviseService
    , public sessionSvc: UserSessionSvc
    , private alertSvc: AlertSvc
    , private toastSvc: ToastSvc
    , private loadingSvc: LoadingSvc
    , private router: Router
    , private seoSvc: SeoService
    , private fileSvc: FileService
    , private reportSvc: ReportService
  ) { }

  ngOnInit() {}

  ngOnChanges( changes: SimpleChanges ): void {
    if ( 'iAdvise' in changes) {
      this.iAdvise = changes.iAdvise.currentValue

      this.seoSvc.generateTags({
        title: this.iAdvise.title,
        description: this.iAdvise.content,
        image: this.fileSvc.img2str( this.iAdvise.photo )
      })
    }
  }

  extractTitle(): string
  {
    return this.adviseSvc.extractTitle( this.iAdvise )
  }

  extractSummary(): string
  {
    return this.adviseSvc.extractSummary( this.iAdvise )
  }

  async options( event )
  {
    let opts: IOptsMenuButton[]
    
    if( await this.sessionSvc.isUser( this.iAdvise?.uid ))
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
    this.router.navigate([ `posts/oracle/${this.id}/edit` ])
  }

  async delete()
  {
    if( await this.alertSvc.confirm({
        title: 'pages.posts.advises.delete.title'
      , msg: 'pages.posts.advises.delete.msg'
    } as IAlert )) {
      this.loadingSvc.show()
      const { response, error } = await this.adviseSvc.delete( this.id )
      this.loadingSvc.dismiss()

      if( error ) {
        this.toastSvc.show( error.msg || error.message || 'Error on deleting', true )
        return
      }

      this.toastSvc.show( response.message, true )
      this.router.navigate([ `posts/oracles` ])
    }
  }

  report()
  {
    this.reportSvc.show({
      advise: this.id
    } as IReport )
  }

  comment( value: string | number )
  {

  }
}
