import {ChatService} from 'src/app/services/chat.service';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PopoverController, AlertController} from '@ionic/angular';
import {FileService} from 'src/app/components/file-picker/services/file.service';
import {MailService} from 'src/app/services/mail.service';
import {ReportService} from 'src/app/services/report.service';
import {RouteSvc} from 'src/app/services/route.service';
import {environment} from 'src/environments/environment';
import {IAdviseFull} from '../posts/advises/models/advises.model';
import {AdviseService} from '../posts/advises/services/advises.service';
import {UserDataService} from '../user-data/Services/user-data.service';
import {Location} from '@angular/common';
import { SearchService } from 'src/app/tab1/search/services/search.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserSessionSvc } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-perfil-oraculo',
  templateUrl: './perfil-oraculo.page.html',
  styleUrls: ['./perfil-oraculo.page.scss'],
})
export class PerfilOraculoPage implements OnInit {
  idPerfil: any;
  user: any;
  iAdvises: IAdviseFull[] = [];
  ratings: any;
  bests: any;
  isFeed: boolean = true;
  isRatings: boolean = false;
  isBest: boolean = false;
  postUser;
  post;
  moreWorks: any = [];
  apiMetaTagUrl: string = `${environment.baseWebUrl}api/auth/meta-tags`;
  linksArray: string[] = [];

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
  curUser
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
  ) {
    this.route.paramMap.subscribe((params) => {
      this.idPerfil = params.get('id');


    });
  }

  ngOnDestroy() {
  }
  async ngOnInit() {
    
    this.getFeed();
    this.getUserDetail();
    
    this.getProductUser()
    this.ratings = [];
    this.bests = [];
    this.curUser = await this.sessionSvc.get();
   
    if ( Number(this.curUser.id) == Number(this.idPerfil)) {
      this.hideChat = true;
    } else {
      this.hideChat = false;
    }

    this.cdref.detectChanges();
    
  }

  async getUserDetail() {
    const {response} = await this.userDataService.getUserDetail(
      this.idPerfil
    );
    if (response) {
      this.user = {
        name: response.username,
        description: response.description,
        email: response.email,
        phoneNumber: response.phoneNumber,
        date: '12 April at 09.28 PM', // ToDo: Remove this hardcoded value
      };
      this.getProductDetail()
    }
  }

 


  async getProductUser() {

    
    const user = JSON.parse(sessionStorage.getItem('productId'));
    
    const {response, error} = await this.profileUser.getUserProduct(this.idPerfil);
    if (!!response)
    this.moreWorks = response.available;



  }


  async getProductDetail() {
    const user = JSON.parse(sessionStorage.getItem('productId'));
    const {response} =  await this.searchService.getProductDetail(user);
    if (response) {
      this.detalle = response;
      console.log(this.detalle)
      this.user.avatar = response.ownerAvatar 
    }
  }

  async getFeed() {
    var filters = {
      activePage: 1,
      keys: null,
      topic: null,
      sector: null,
      subsector: null,
      lang: null,
      user: this.idPerfil,
      hideContent: true,
      content: null,
    };
    const {response, error} = await this.adviseSvc.list(filters);
    this.iAdvises = response;
  }

  removeBlankSpace(term: string): string {
   
    if ( term !== null){
      return term.replace(new RegExp(' ', 'g'), '-');
    } else {
      return term
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
    const {response, error} = await this.chatService.createChat(
      this.idPerfil
    );

    if (response) {
      this.router.navigate([`chat/${response?.id}`], {
        state: {receiverId: this.idPerfil, receiverUsername: this.user.name},
      });
    }

    if (error) {
      this.router.navigate([`chat`]);
    }
  }
  public irA(p: string): void {
    this.router.navigate([p]);
  }
  backButton() {
    this.location.back();
  }

  async registerClick(user, profile){
    let userId = await this.sessionSvc.get();
    let data = {
      user: userId?.id,
      profile: profile
    }
    const {response, error} = await this.searchService.registerClick(data);
  }
}
