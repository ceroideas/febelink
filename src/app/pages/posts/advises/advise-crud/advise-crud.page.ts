import { Component, OnInit, ViewChild } from '@angular/core';
import { iWYSIWYG } from 'src/app/components/wysiwyg/models/wysiwyg.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IAdviseFull } from '../models/advises.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../../components/file-picker/services/file.service';
import { ToastSvc } from 'src/app/services/toast.service';
import { AdviseService } from '../services/advises.service';
import { SectorsComponent } from 'src/app/components/sectors/sectors.component';
import { AlertSvc } from 'src/app/services/alert.service';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { LoadingSvc } from 'src/app/services/loading.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { IFile } from 'src/app/components/file-picker/models/file.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-advise-crud',
  templateUrl: './advise-crud.page.html',
  styleUrls: ['./advise-crud.page.scss'],
})
export class AdviseCRUDPage implements OnInit
{

  @ViewChild( "sectors" ) sectors: SectorsComponent
  @ViewChild( "lang" ) lang: LangBtnComponent
  
  isLoading: boolean = false

  form: FormGroup
  iFile: IFile = {}
  content: iWYSIWYG = {}

  id: number
  iAdvise: IAdviseFull

  paramsQuery: any
  paramsUrl: any

  hasVerifiedEmail: boolean

  constructor(
      private formBuilder: FormBuilder
    , public mediaSvc: FileService
    , private actRoute: ActivatedRoute
    , private router: Router
    , private adviseSvc: AdviseService
    , private toastSvc: ToastSvc
    , private alertSvc: AlertSvc
    , private loadingSvc: LoadingSvc
    , private sessionSvc: UserSessionSvc
    , private userSvc: UserService
  ) {}

  async ngOnInit()
  {
    this.buildForm();

    this.paramsQuery = this.actRoute.snapshot.queryParamMap;
    this.paramsUrl = this.actRoute.snapshot.params

    /* If user not logged, can't create  */
    if( !( await this.sessionSvc.isLogged )) {
      this.kickOff()
      return
    }

    if( this.paramsUrl?.id )
      this.getPost( this.paramsUrl?.id )

      this.hasVerifiedEmail = await this.userSvc.verifiedEmail()
  }

  /* If has id -> editing post */
  async getPost( id: number )
  {
    this.isLoading = true;

    this.id = id
    const { response, error } = await this.adviseSvc.get( id )
    this.iAdvise = response
    if( error || !( await this.sessionSvc.isUser( this.iAdvise?.uid )))
    {
      this.kickOff()
      return
    }

    this.updateForm()
    this.isLoading = false
  }

  ionViewDidLeave()
  {
    this.clear()
  }

  buildForm()
  {
    const disabled = this.paramsUrl?.id && this.isLoading

    this.form = this.formBuilder.group({
      title: new FormControl({ value: this.iAdvise?.title || '', disabled: disabled }, Validators.required ),
      subtitle: new FormControl({ value: this.iAdvise?.subtitle || '', disabled: disabled }, Validators.required ),
      summary: new FormControl({ value: this.iAdvise?.summary || '', disabled: disabled }, Validators.required ),
    })
  }

  updateForm()
  {
    this.form.patchValue({
      title: this.iAdvise?.title || '',
      subtitle: this.iAdvise?.subtitle || '',
      summary: this.iAdvise?.summary || '',
    })

    this.content.html = this.iAdvise?.content
    this.iFile.src = this.iAdvise?.media_url
    this.iFile.ext = this.iAdvise?.media_ext

    console.log({ iFile: this.iFile, iAdvise: this.iAdvise })
  }

  clear()
  {
    this.iAdvise = null
    this.content.html = ''
    this.sectors.clear()
    this.fileSelected( null )
    this.form.reset()
  }

  fileSelected( file: IFile )
  {
    this.iFile = file
  }

  wysiwygChange( content: iWYSIWYG )
  {
    this.content = content;
  }

  /* User is not allowed to edit this post */
  kickOff() {
    this.toastSvc.show( 'pages.posts.advises.error.unauthorized', true )
    this.cancel()
  }

  /* On Cancel */
  cancel() {
    this.router.navigate([ 'posts/oracles' ])
  }

  async check(): Promise<boolean>
  {
    const { title } = this.form.value

    /* if( title.length < 4 ) {
      this.toastSvc.show( 'pages.posts.advises.create.error.title', true )
      return false
    } */
    if(( this.content?.html || '' ).length < 4 ) {
      this.toastSvc.show( 'pages.posts.advises.create.error.content', true )
      return false
    }
    if( !this.sectors?.sector ) {
      this.toastSvc.show( 'pages.posts.advises.create.error.sector', true )
      return false
    }

    return true
  }

  /* On Share Advise */
  async shareAlert() {
    if( !( await this.check() ))
      return
    
    if( await this.alertSvc.confirm({
        title: 'pages.posts.advises.title'
      , msg: 'pages.posts.advises.confirm.' + ( this.id ? 'edit' : 'new' )
      , backdropDismiss: false }))
    {
      this.shareAdvise()
    }
  }

  async shareAdvise()
  {
    await this.loadingSvc.show()

    const { title, subtitle, summary } = this.form.value

    const opts: IAdviseFull = {
        lang: this.lang?.langSelected?.id || 1
      , sector: this.sectors?.sector
      , subsector: this.sectors?.subsector == 0 ? null : this.sectors?.subsector
      
      , title: title
      , subtitle: subtitle
      , summary: summary
      , content: this.content.html
      
      , media: this.iFile.file
    }

    const { response, error } = !this.id
      ? await this.adviseSvc.create( opts )
      : await this.adviseSvc.update( this.id, opts )

    await this.loadingSvc.dismiss()

    this.toastSvc.show( error
      ? error.message || error.msg || 'An error ocurred on creating post'
      : response.message, true )
    if( error )
      return
    
    // this.askNew()
    this.cancel()
  }

  askNew()
  {
    this.alertSvc.show({
        title: 'pages.posts.advises.new.title'    
      , msg: 'pages.posts.advises.new.msg'
      , btns: [
        {
          text: 'common.buttons.back',
          handler: () => this.cancel()
        },
        {
          text: 'common.buttons.create',
          handler: () => this.clear()
        }
      ]
      , backdropDismiss: false
    }, true)
  }
}
