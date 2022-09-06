import { Component, OnInit, ViewChild } from '@angular/core';
import { iWYSIWYG } from 'src/app/components/wysiwyg/models/wysiwyg.model';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IAdviseFull, ITopic } from '../models/advises.model';
import { ActivatedRoute } from '@angular/router';
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
import { RouteSvc } from 'src/app/services/route.service';

@Component({
  selector: 'app-post-advise-crud',
  templateUrl: './advise-crud.page.html',
  styleUrls: ['./advise-crud.page.scss'],
})
export class AdviseCRUDPage implements OnInit {
  @ViewChild('sectors') sectors: SectorsComponent;
  @ViewChild('lang') lang: LangBtnComponent;

  isLoading: boolean = false;

  form: UntypedFormGroup;
  iFile: IFile = {};
  content: iWYSIWYG = {};
  contentText:any;

  id: number;
  iAdvise: IAdviseFull;

  id_reference: number;
  reference: IAdviseFull;

  paramsQuery: any;
  paramsUrl: any;

  hasVerifiedEmail: boolean;

  topicSelected: ITopic;
  topics = [
    { id: null, name: 'Todos' },
    { id: 1, name: 'Política' },
    { id: 2, name: 'Música' },
    { id: 3, name: 'Deportes' },
    { id: 4, name: 'Moda y Belleza' },
    { id: 5, name: 'Ocio' },
    { id: 6, name: 'Arte y Cultura' },
    { id: 7, name: 'Marketing' },
    { id: 8, name: 'Negocios' },
    { id: 9, name: 'Startups' },
    { id: 10, name: 'Tecnología' },
    { id: 11, name: 'Cine' },
    { id: 12, name: 'Naturaleza' },
    { id: 13, name: 'Ciencia' },
    { id: 14, name: 'Economía y Finanzas' },
    { id: 15, name: 'Anime y Manga' },
    { id: 16, name: 'Noticias y Actualidad' },
    { id: 17, name: 'Viajes' },
    { id: 18, name: 'Hogar y Familia' },
    { id: 19, name: 'Comida' },
    { id: 20, name: 'Videojuegos' },
    { id: 21, name: 'Salud' },
    { id: 22, name: 'Criptomonedas' },
    { id: 23, name: 'Animales' },
    { id: 24, name: 'Historia' },
  ]; // ToDo: HARDCODED! Fetch this info from DB

  constructor(
    private formBuilder: UntypedFormBuilder,
    public mediaSvc: FileService,
    private actRoute: ActivatedRoute,
    private router: RouteSvc,
    private adviseSvc: AdviseService,
    private toastSvc: ToastSvc,
    private alertSvc: AlertSvc,
    private loadingSvc: LoadingSvc,
    private sessionSvc: UserSessionSvc,
    private userSvc: UserService
  ) {}

  async ngOnInit() {
    this.buildForm();

    this.paramsQuery = this.actRoute.snapshot.queryParamMap;
    this.paramsUrl = this.actRoute.snapshot.params;

    /* If user not logged, can't create  */
    if (!(await this.sessionSvc.isLogged())) {
      this.kickOff();
      return;
    }

    if (this.paramsUrl?.id) this.getPost(this.paramsUrl?.id);
    if (this.paramsQuery?.params?.id_reference)
      this.getReference(this.paramsQuery?.params?.id_reference);

    this.hasVerifiedEmail = await this.userSvc.verifiedEmail();
  }

  /* If has id -> editing post */
  async getPost(id: number) {
    this.isLoading = true;

    this.id = id;
    const { response, error } = await this.adviseSvc.get(id);
    this.iAdvise = response;
    if (error || !(await this.sessionSvc.isUser(this.iAdvise?.uid))) {
      this.kickOff();
      return;
    }

    this.updateForm();
    this.isLoading = false;
  }

  /* If has id -> editing post */
  async getReference(id: number) {
    this.id_reference = id;
    const { response, error } = await this.adviseSvc.get(id);
    if (response) this.reference = response;
  }

  ionViewDidLeave() {
    this.clear();
  }

  buildForm() {
    const disabled = this.paramsUrl?.id && this.isLoading;

    this.form = this.formBuilder.group({
      title: new UntypedFormControl(
        { value: this.iAdvise?.title || '', disabled: disabled },
        Validators.required
      ),
      subtitle: new UntypedFormControl(
        { value: this.iAdvise?.subtitle || '', disabled: disabled },
        Validators.required
      ),
      summary: new UntypedFormControl(
        { value: this.iAdvise?.summary || '', disabled: disabled },
        Validators.required
      ),
      topic: new UntypedFormControl(
        { value: this.iAdvise?.topic || '', disabled: disabled },
        Validators.required
      ),
      content: new UntypedFormControl(
        { value: this.iAdvise?.content || '', disabled: disabled },
        Validators.required
      ),
    });
  }

  updateForm() {
    this.form.patchValue({
      topic: this.iAdvise?.topic || '',
      title: this.iAdvise?.title || '',
      subtitle: this.iAdvise?.subtitle || '',
      summary: this.iAdvise?.summary || '',
    });

    //this.content.html = this.iAdvise?.content;
    this.topicSelected = this.topics[this.iAdvise?.topic];
    this.contentText = this.iAdvise?.content;
    this.iFile.src = this.iAdvise?.media_url;
    this.iFile.ext = this.iAdvise?.media_ext;
  }

  clear() {
    this.iAdvise = null;
    this.content.html = '';
    this.fileSelected(null);
    this.form.reset();
    this.id_reference = null;
  }

  fileSelected(file: IFile) {
    this.iFile = file;
    if (file == null && this.iAdvise) {
      this.iAdvise.media_name = null;
      this.iAdvise.media_ext = null;
    }
  }

  wysiwygChange(content: iWYSIWYG) {
    this.content = content;
  }

  /* User is not allowed to edit this post */
  kickOff() {
    this.toastSvc.show('pages.posts.advises.error.unauthorized', true);
    this.goHome();
  }

  /* On Cancel */
  goHome(canceled: boolean = true) {
    if (canceled) this.router.navigate(['posts/oracles']);
    else this.router.navigateReload(['posts/oracles']);
  }

  async check(): Promise<boolean> {
    const { title } = this.form.value;

    /* if( title.length < 4 ) {
      this.toastSvc.show( 'pages.posts.advises.create.error.title', true )
      return false
    } */

    // if 'iAdvise.id_advise' || 'id_reference' -> Is referencing, no need to have comment
    if (
      (this.content?.html || '').length < 4 &&
      !this.iFile?.file
      // !this.iAdvise?.id_advise &&
      // !this.id_reference
    ) {
      this.toastSvc.show('pages.posts.advises.create.error.content', true);
      return false;
    }

    return true;
  }

  /* On Share Advise */
  async shareAlert() {
    //if (!(await this.check())) return;

    if (
      await this.alertSvc.confirm({
        title: 'pages.posts.advises.title',
        msg: 'pages.posts.advises.confirm.' + (this.id ? 'edit' : 'new'),
        backdropDismiss: false,
      })
    ) {
      this.adviseSvc.showCreatePost = !this.adviseSvc.showCreatePost;
      this.shareAdvise();
    }
  }

  async shareAdvise() {
    await this.loadingSvc.show();

    const { title, subtitle, summary, topic } = this.form.value;

    const opts: IAdviseFull = {
      topic: topic.id,
      lang: this.lang?.langSelected?.id || 1,

      id_advise: this.id_reference,

      title: title,
      subtitle: subtitle,
      summary: summary,
      content: this.contentText,

      media: this.iFile?.file,
      media_name: this.iAdvise?.media_name,
      media_ext: this.iAdvise?.media_ext,
    };

    const { response, error } = !this.id
      ? await this.adviseSvc.create(opts)
      : await this.adviseSvc.update(this.id, opts);

    await this.loadingSvc.dismiss();

    this.toastSvc.show(
      error
        ? error.message || error.msg || 'An error ocurred on creating post'
        : response.message,
      true
    );
    if (error) return;

    // this.askNew()
    this.goHome(false);
  }

  askNew() {
    this.alertSvc.show(
      {
        title: 'pages.posts.advises.new.title',
        msg: 'pages.posts.advises.new.msg',
        btns: [
          {
            text: 'common.buttons.back',
            handler: () => this.goHome(),
          },
          {
            text: 'common.buttons.create',
            handler: () => this.clear(),
          },
        ],
        backdropDismiss: false,
      },
      true
    );
  }
}
