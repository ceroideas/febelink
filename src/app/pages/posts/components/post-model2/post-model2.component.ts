import {HttpClient} from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {FileService} from 'src/app/components/file-picker/services/file.service';
import {IOptsMenuButton} from 'src/app/components/opts-menu/models/opts-menu.model';
import {OptsMenuSvc} from 'src/app/components/opts-menu/services/opts-menu.service';
import {IReport} from 'src/app/models/report.model';
import {IUser} from 'src/app/models/user.model';
import {DateFormatType} from 'src/app/pipes/date-format.pipe';
import {AlertSvc, IAlert} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ReportService} from 'src/app/services/report.service';
import {SeoService} from 'src/app/services/seo.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {UserSessionSvc} from 'src/app/services/user-session.service';
import {environment} from 'src/environments/environment';
import {IAdviseFull} from '../../advises/models/advises.model';
import {AdviseService} from '../../advises/services/advises.service';
import {Meta} from '@angular/platform-browser';
import {RouteSvc} from '../../../../services/route.service';

@Component({
  selector: 'app-post-model2-component',
  templateUrl: './post-model2.component.html',
  styleUrls: ['./post-model2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostModel2Component implements OnInit, AfterViewInit {
  @Input() id: number;
  @Input() type: number = 0;
  @Input() iAdvise: IAdviseFull;
  @Input() showLang: boolean = false;
  @Input() showOpts: boolean = false;
  @Input() showSeePost: boolean = false;
  @Input() showContent: boolean = false;
  @Input() listComments: boolean = false;

  isPostVisible: boolean = true;
  areCommentsVisible: boolean = true;

  apiMetaTagUrl: string = `${environment.baseWebUrl}api/auth/meta-tags`;
  linksArray: string[] = [];

  dateFormatType = DateFormatType;
  iUser: IUser;

  oracleRef: IAdviseFull;
  showFollow: boolean = false;
  postUser: IUser;
  topic: string;
  topics = [
    {id: null, name: 'Todos'},
    {id: 1, name: 'Política'},
    {id: 2, name: 'Música'},
    {id: 3, name: 'Deportes'},
    {id: 4, name: 'Moda y Belleza'},
    {id: 5, name: 'Ocio'},
    {id: 6, name: 'Arte y Cultura'},
    {id: 7, name: 'Marketing'},
    {id: 8, name: 'Negocios'},
    {id: 9, name: 'Startups'},
    {id: 10, name: 'Tecnología'},
    {id: 11, name: 'Cine'},
    {id: 12, name: 'Naturaleza'},
    {id: 13, name: 'Ciencia'},
    {id: 14, name: 'Economía y Finanzas'},
    {id: 15, name: 'Anime y Manga'},
    {id: 16, name: 'Noticias y Actualidad'},
    {id: 17, name: 'Viajes'},
    {id: 18, name: 'Hogar y Familia'},
    {id: 19, name: 'Comida'},
    {id: 20, name: 'Videojuegos'},
    {id: 21, name: 'Salud'},
    {id: 22, name: 'Criptomonedas'},
  ]; // ToDo: HARDCODED! Fetch this info from DB

  constructor(
    private optsMenuSvc: OptsMenuSvc,
    private adviseSvc: AdviseService,
    public sessionSvc: UserSessionSvc,
    private alertSvc: AlertSvc,
    private toastSvc: ToastSvc,
    private loadingSvc: LoadingSvc,
    private router: RouteSvc,
    private seoSvc: SeoService,
    public fileSvc: FileService,
    private reportSvc: ReportService,
    private http: HttpClient,
    private metaService: Meta
  ) {
  }

  ngAfterViewInit(): void {
    if (this.iAdvise.media_url) {
      this.metaService.updateTag({
        property: 'og:image',
        content: this.iAdvise.media_url,
      });
      this.metaService.updateTag({
        property: 'og:image:url',
        content: this.iAdvise.media_url,
      });
    }
  }

  ngOnInit() {

 
    this.metaService.updateTag({
      property: 'og:image',
      content: this.iAdvise?.media_url,
    });
    this.metaService.updateTag({
      property: 'og:image:url',
      content: this.iAdvise?.media_url,
    });

    this.topic = this.topics.find((topic) => {
      return topic.id === this.iAdvise?.topic;
    }).name; // ToDo: Fetch this info from DB
    this.sessionSvc.get().then((userData) => {
      this.iUser = userData;
      this.showFollow = this.postUser?.id != this.iUser?.id && this.showContent;
    });
    if (this.iAdvise?.content) {
      const html = this.iAdvise.content;
      const div = document.createElement('div');
      div.innerHTML = html.replace(/<br>/g, ' ').replace(/<p>|<\/p>/g, ' ');
      const adaptedText = div.textContent || div.innerText || '';

      this.linksArray = adaptedText
        .split(/[\s,]+|\.\s/)
        .filter((splitedWord) => {
          if (splitedWord.match(/^https?:\/\/.*\.(com|es|net|org|be)/i)) {
            return splitedWord.match(/^https?:\/\/.*\.(com|es|net|org|be)/i)[0];
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('iAdvise' in changes) {
      this.iAdvise = changes.iAdvise.currentValue;

      this.postUser = {
        id: this.iAdvise.uid,

        topic: null,

        nick: this.iAdvise.nick,
        name: this.iAdvise.name,
        lastName: this.iAdvise.lastName,

        logo: this.iAdvise.logo,
        avatar: this.iAdvise.avatar,

        email: this.iAdvise.email,

        public: this.iAdvise.public,
      } as IUser;
      this.showFollow = this.postUser?.id != this.iUser?.id && this.showContent;

      /* this.seoSvc.generateTags({
        title: this.iAdvise.title,
        description: this.iAdvise.content,
        image: this.fileSvc.img2str(this.iAdvise.media_url),
      }); */

      this.getReference();
    }
  }

  async getReference() {
    if (!this.iAdvise?.id_advise) {
      return;
    }

    const {response, error} = await this.adviseSvc.get(
      this.iAdvise?.id_advise
    );
    if (response) {
      this.oracleRef = response;
    }
  }

  extractTitle(): string {
    return this.adviseSvc.extractTitle(this.iAdvise, this.showContent);
  }

  extractSummary(): string {
    return this.adviseSvc.extractSummary(this.iAdvise);
  }

  async options(event) {
    let opts: IOptsMenuButton[];

    if (await this.sessionSvc.isUser(this.iAdvise?.uid)) {
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
    } else {
      opts = [
        {
          text: 'common.buttons.report',
          click: (iOptsMenuButton: IOptsMenuButton) => this.report(),
        } as IOptsMenuButton,
      ];
    }

    this.optsMenuSvc.show(event, opts);
  }

 
  async edit() {
    let searchText = ''
    let lower = ''
    searchText = this.iAdvise?.title.replace(new RegExp(' ', 'g'), '-');
    searchText= this.removeAccents(searchText)

    lower = searchText.toLowerCase();
    this.router.navigate([`posts/oracle/${this.id}/${lower}/edit`], {
      queryParams: !this.iAdvise?.id_advise
        ? {}
        : {id_reference: this.iAdvise?.id_advise},
    });
  }

  async delete() {
    if (
      await this.alertSvc.confirm({
        title: 'pages.posts.advises.delete.title',
        msg: 'pages.posts.advises.delete.msg',
      } as IAlert)
    ) {
      this.loadingSvc.show();
      const {response, error} = await this.adviseSvc.delete(this.id);
      await this.loadingSvc.dismiss();

      if (error) {
        this.toastSvc.show(
          error.msg || error.message || 'Error on deleting',
          true
        );
        return;
      }

      this.toastSvc.show(response.message, true);
      this.router.navigateReload([`oracles`]);
    }
  }

  report() {
    this.reportSvc.show({
      advise: this.id,
    } as IReport);
  }

  navigateToPost() {
    this.router.navigate([`posts/oracle/${this.id}`]);
  }

  public apiCallbackFn = (route: string) => {
    try {
      return this.http.get(route);
    } catch (error) {
      console.log('ups', error);
    }
  };

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedString;
  }
 
  watch() {
    let searchText = ''
    if ( this.iAdvise.title == null || this.iAdvise.title == undefined || this.iAdvise.title == '' ) {
      this.router.navigate([`posts/oracle/${this.id}`]);
    }else{
      
      searchText = this.iAdvise.title.replace(new RegExp(' ', 'g'), '-');
      searchText= this.removeAccents(searchText)
      let lower = searchText.toLowerCase();
      
      this.router.navigate([`posts/oracle/${this.id}/`+ lower]);
    }
  }
}
