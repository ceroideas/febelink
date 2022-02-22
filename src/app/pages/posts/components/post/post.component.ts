import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IOptsMenuButton } from 'src/app/components/opts-menu/models/opts-menu.model';
import { OptsMenuSvc } from 'src/app/components/opts-menu/services/opts-menu.service';
import { DateFormatType } from 'src/app/pipes/date-format';
import { AlertSvc, IAlert } from 'src/app/services/alert.service';
import { LoadingSvc } from 'src/app/services/loading.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { IAdviseFull } from '../../advises/models/advises.model';
import { AdviseService } from '../../advises/services/advises.service';

@Component({
  selector: 'app-post-component',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() id: number
  @Input() iAdvise: IAdviseFull
  @Input() showLang: boolean = false
  @Input() showOpts: boolean = false
  @Input() showSeePost: boolean = false
  @Input() showContent: boolean = false

  dateFormatType = DateFormatType

  constructor(
      private optsMenuSvc: OptsMenuSvc
    , private adviseSvc: AdviseService
    , private sessionSvc: UserSessionSvc
    , private alertSvc: AlertSvc
    , private toastSvc: ToastSvc
    , private loadingSvc: LoadingSvc
    , private router: Router
  ) { }

  ngOnInit() {}

  options( event )
  {
    let opts: IOptsMenuButton[]
    
    if( this.sessionSvc.isUser( this.iAdvise?.uid ))
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
    if( !( await this.sessionSvc.isUser( this.iAdvise?.uid ))) {
      this.toastSvc.show( 'pages.posts.advises.error.unauthorized', true )
      return
    }

    this.router.navigate([ `posts/advise/${this.id}/edit` ])
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
      this.router.navigate([ `posts/advises` ])
    }
  }

  report()
  { // ToDo
    this.toastSvc.show( 'common.developing', true )
  }
}
