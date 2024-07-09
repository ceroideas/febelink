import {ChatService} from './../../services/chat.service';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopoverController, AlertController} from '@ionic/angular';
import {FileService} from './../../components/file-picker/services/file.service';
import {MailService} from './../../services/mail.service';
import {ReportService} from './../../services/report.service';
import {RouteSvc} from './../../services/route.service';
import {IAdviseFull} from '../posts/advises/models/advises.model';
import {AdviseService} from '../posts/advises/services/advises.service';
import {UserDataService} from '../user-data/Services/user-data.service';
import {Location, isPlatformBrowser} from '@angular/common';
import { SearchService } from './../../tab1/search/services/search.service';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { UserSessionSvc } from './../../services/user-session.service';
import { environment } from '../../../environments/environment';

import { toSlug } from '../../../utils/utils';

@Component({
  selector: 'app-perfil-oraculo',
  templateUrl: './perfil-oraculo.page.html',
  styleUrls: ['./perfil-oraculo.page.scss'],
})
export class PerfilOraculoPage implements OnInit {

  toSlug = toSlug;

  idPerfil: any;
  user: any;
  iAdvises: IAdviseFull[] = [];
  ratings: any;
  bests: any;
  isFeed: boolean = true;
  isRatings: boolean = false;
  isBest: boolean = false;
  postUser: any;
  post: any;
  moreWorks: any = [];
  apiMetaTagUrl: string = `${environment.baseWebUrl}api/auth/meta-tags`;
  linksArray: string[] = [];
  urlWsrv: string = environment.baseWebUrlWsrv;
  hideChat: boolean = false;
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
  public detalle: any;
  curUser: any;
  constructor(
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    public alertController: AlertController,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    private adviseSvc: AdviseService,
    private userDataService: UserDataService,
    private router: RouteSvc,
    public fileSvc: FileService,
    private http: HttpClient,
    private chatService: ChatService,
    private location: Location,
    private profileUser: UserDataService,
    private searchService: SearchService,
    public authService: AuthenticationService, 
    public sessionSvc: UserSessionSvc,
    public cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) public platformId: Object,
  ) {
    this.route.paramMap.subscribe((params) => {
      this.idPerfil = params.get('id');
    });
  }

  ngOnDestroy() {
  }
  async ngOnInit() {
    
    this.getUserDetail();
    
    this.getProductUser()
    this.ratings = [];
    this.bests = [];
    this.curUser = await this.sessionSvc.get();
   
    // if (this.curUser !== undefined &&  Number(this.curUser.id) == Number(this.idPerfil)) {
    //   this.hideChat = true;
    // } else {
    //   this.hideChat = false;
    // }

    // this.cdref.detectChanges();
    
  }

  async getUserDetail() {


    this.userDataService.getUserDetail( this.idPerfil ).then(async (data: any) => {
      if (data.response) {
        this.user = {
          name: data.response.username,
          description: data.response.description,
          email: data.response.email,
          phoneNumber: data.response.phoneNumber,
          date: '12 April at 09.28 PM', // ToDo: Remove this hardcoded value
        };

        this.getProductDetail()
      }
    })
   
  }

 


  async getProductUser() {

    this.profileUser.getUserProduct( this.idPerfil ).then(async (data: any) => {
      if (!!data.response)
        this.moreWorks = data.response.available;
    })

  }


  async getProductDetail() {
    if ( isPlatformBrowser(this.platformId) ) {

      //@ts-ignore
      const productId = JSON.parse(sessionStorage.getItem('productId'));

      this.searchService.getProductDetail( productId ).then(async (data: any) => {
        if (data.response) {
          this.detalle = data.response;
          this.user.avatar = data.response.ownerAvatar 
        }
      })
   }
  }

  showFeed() {
    this.isFeed = true;
    this.isRatings = false;
    this.isBest = false;
  }

  showRatings() {
    this.isFeed = false;
    this.isRatings = true;
    this.isBest = false;
  }

  showBest() {
    this.isFeed = false;
    this.isRatings = false;
    this.isBest = true;
  }

  //@ts-ignore
  public apiCallbackFn = (route: string) => {
    try {
      return this.http.get(route);
    } catch (error) {
      console.log('ups', error);
    }
  };

  navigateToPost(id: number) {
    this.router.navigate([`posts/oracle/${id}`]);
  }

  async createChat() {


    this.chatService.createChat( this.idPerfil ).then(async (response: any) => {
      if (response) {
        this.router.navigate([`chat/${response?.id}`], {
          state: {receiverId: this.idPerfil, receiverUsername: this.user.name},
        });
      } else {
        this.router.navigate([`chat`]);
      }
    })

   
  }

  
  async registerClick(user: any, profile: any){
    let userId = await this.sessionSvc.get();
    let data = {
      user: userId?.id,
      profile: profile
    }
    const {response, error} = await this.searchService.registerClick(data);
  }
  public irA(p: string): void {
    this.router.navigate([p]);
  }
  backButton() {
    this.location.back();
  }
}
