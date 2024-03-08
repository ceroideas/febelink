import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { MailService } from 'src/app/services/mail.service';
import { ReportService } from 'src/app/services/report.service';
import { IAdviseFull } from '../posts/advises/models/advises.model';
import { AdviseService } from '../posts/advises/services/advises.service';
import { UserDataService } from '../user-data/Services/user-data.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.page.html',
  styleUrls: ['./mis-publicaciones.page.scss'],
})
export class MisPublicacionesPage implements OnInit {
  idPerfil: 208
  user: any;
  iAdvises: IAdviseFull[] = [];
  ratings: any;
  ratingsPending: any;
  bests: any;
  bestsChange: any;
  isFeed: boolean = true;
  isRatings: boolean = false;
  isBest: boolean = false;
  isRatingsDone: boolean = true;
  isRatingsPending: boolean = true;
  isBestList: boolean = false;
  isBestAchieves: boolean = true;
  isBestChange: boolean = false;
  isBestChangeList: boolean = true;
  selectedBest: number;

  isBestChanged: boolean = false;
  isRatingSaved: boolean = false;
  openRating: boolean = false;
  indexRating: number = null;

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
  ]; // ToDo: HARDCODED! Fetch this info from DB
  currentUser: any = {};
  constructor(
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    private adviseSvc: AdviseService,
    private userDataService: UserDataService,
    private utilities: UtilitiesService,
  ) {}

  async ngOnInit() {
    this.currentUser = { ...(await this.utilities.getUserData()) };

    this.getUserInfo();
    this.getFeed();
    this.ratings = [];
    this.ratingsPending = [];
    this.bests = {};
    this.bestsChange = [];
  }

  async getUserInfo() {
    const { response } = await this.userDataService.getUserInfo();
    if (response) {
      this.user = response  ;
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
      user: this.currentUser.id,
      hideContent: true,
      content: null,
    };
    const { response, error } = await this.adviseSvc.list(filters);
    this.iAdvises = response;
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

  createPost() {
    this.router.navigate(['posts/oracle/create']);
  }

  doRating(index: number) {
    this.indexRating = index;
    this.openRating = true;
  }

  saveRating() {
    var rating = {
      title: this.ratingsPending[this.indexRating].title,
      service: this.ratingsPending[this.indexRating].service,
      img: this.ratingsPending[this.indexRating].img,
      price: this.ratingsPending[this.indexRating].price,
      rating: 5,
      date: '20/08/2022',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text. Lorem Ipsum has been lorem Ipsum is simply. Lorem Ipsum is simply dummy text.',
    };

    this.ratings.push(rating);
    this.ratingsPending.splice(this.indexRating, 1);

    this.isRatingSaved = true;
    this.openRating = false;
    this.indexRating = null;
  }

  selectBest(index: number) {
    this.selectedBest = index;
  }

  changeBest() {
    if (this.selectedBest >= 0) {
      this.bests = {
        title: this.bestsChange[this.selectedBest].title,
        service: this.bestsChange[this.selectedBest].service,
        img: this.bestsChange[this.selectedBest].img,
        price: this.bestsChange[this.selectedBest].price,
        rating: this.bestsChange[this.selectedBest].rating,
        date: this.bestsChange[this.selectedBest].date,
      };

      this.isBestChanged = true;
      this.isBestChange = false;
      this.selectedBest = null;
    }
  }
}
