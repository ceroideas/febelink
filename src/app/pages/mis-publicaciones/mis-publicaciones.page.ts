import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, PopoverController, Platform, AlertController } from '@ionic/angular';
import { PublicarOpinionPage } from '../publicar-opinion/publicar-opinion.page';
import { GuidePage } from '../guide/guide.page';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { IUser } from 'src/app/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { MailService } from 'src/app/services/mail.service';
import { ReportService } from 'src/app/services/report.service';
import { IReport } from 'src/app/models/report.model';
import {IAdviseFull, IAdviseFilter, ITopic} from '../posts/advises/models/advises.model';
import {AdviseService} from '../posts/advises/services/advises.service';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
})
export class MisPublicacionesPage implements OnInit {

  idPerfil:any=2697;
  user:any;
  iAdvises: IAdviseFull[] = [];
  ratings:any;
  ratingsPending:any;
  bests:any;
  bestsChange:any;
  isFeed:boolean=true;
  isRatings:boolean=false;
  isBest:boolean=false;
  isRatingsDone:boolean=true;
  isRatingsPending:boolean=true;
  isBestList:boolean=true;
  isBestAchieves:boolean=true;
  isBestChange:boolean=false;
  isBestChangeList:boolean=true;
  selectedBest:number;

  isBestChanged:boolean=false;
  isRatingSaved:boolean=false;
  openRating:boolean=false;
  indexRating:number=null;

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
    private route: ActivatedRoute,
    private api: ApiService,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    private utilities: UtilitiesService,
    private translateService: TranslateService,
    private authSvc:AuthenticationService,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    private adviseSvc: AdviseService,
  ) {

  }

  ngOnInit() {
    this.getFeed();
    this.user = {
      name: 'Manuel Díaz',
      img: 'assets/imgs/4.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem ipsum.Lorem Ipsum has been lorem Ipsum is simply.'
    };
    this.ratings = [
      {
        title: 'Manuel Díaz',
        service: 'Masaje contracturante',
        img: 'assets/imgs/4.jpg',
        price: 35,
        rating: 5,
        date: '20/08/2022',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text.'
      },
      {
        title: 'Manuel Díaz',
        service: 'Masaje relajante',
        img: 'assets/imgs/4.jpg',
        price: 25,
        rating: 5,
        date: '25/08/2022',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text.'
      }
    ];
    this.ratingsPending = [
      {
        title: 'Manuel Díaz',
        service: 'Masaje contracturante',
        img: 'assets/imgs/4.jpg',
        price: 35
      },
      {
        title: 'Manuela Díaz',
        service: 'Masaje contracturante',
        img: 'assets/imgs/4.jpg',
        price: 353
      }
    ];
    this.bests = {
        title: 'Manuel Díaz',
        service: 'Masaje contracturante',
        img: 'assets/imgs/4.jpg',
        price: 35,
        rating: 5,
        date: '20/08/2022'
      };
    this.bestsChange = [
      {
        title: 'Manuel Díaz',
        service: 'Masaje contracturante',
        img: 'assets/imgs/4.jpg',
        price: 35,
        rating: 5,
        date: '20/08/2022'
      },
      {
        title: 'Daniel Díaz',
        service: 'Masaje relajante',
        img: 'assets/imgs/4.jpg',
        price: 30,
        rating: 5,
        date: '20/08/2022'
      }
    ];
  }

  async getFeed() {
    var filters ={
      topic:null,
      sector:null,
      subsector:null,
      lang:null,
      user:this.idPerfil,
      hideContent:null,
      activePage:null
    }
    const {response, error} = await this.adviseSvc.list(filters);
    this.iAdvises=response;
  }

  showFeed() {
    this.isFeed=true;
    this.isRatings=false;
    this.isBest=false;
  }

  showRatings() {
    this.isFeed=false;
    this.isRatings=true;
    this.isBest=false;
  }

  showBest() {
    this.isFeed=false;
    this.isRatings=false;
    this.isBest=true;
  }

  createPost() {
    this.router.navigate(['posts/oracle/create']);
  }

  doRating(index:number) {
    this.indexRating=index;
    this.openRating=true;
  }

  saveRating() {
    var rating = {
      title: this.ratingsPending[this.indexRating].title,
      service: this.ratingsPending[this.indexRating].service,
      img: this.ratingsPending[this.indexRating].img,
      price: this.ratingsPending[this.indexRating].price,
      rating: 5,
      date: '20/08/2022',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text.'
    };

    this.ratings.push(rating);
    this.ratingsPending.splice(this.indexRating, 1);

    this.isRatingSaved=true;
    this.openRating=false;
    this.indexRating=null;
  }

  selectBest(index:number) {
    this.selectedBest=index;
  }

  changeBest() {
    if(this.selectedBest>=0){
      this.bests = {
        title: this.bestsChange[this.selectedBest].title,
        service: this.bestsChange[this.selectedBest].service,
        img: this.bestsChange[this.selectedBest].img,
        price: this.bestsChange[this.selectedBest].price,
        rating: this.bestsChange[this.selectedBest].rating,
        date: this.bestsChange[this.selectedBest].date
      };

      this.isBestChanged=true;
      this.isBestChange=false;
      this.selectedBest=null;
    }
  }

}