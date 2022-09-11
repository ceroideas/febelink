import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from 'src/app/services/api.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ModalController, PopoverController, Platform, AlertController} from '@ionic/angular';
import {PublicarOpinionPage} from '../publicar-opinion/publicar-opinion.page';
import {GuidePage} from '../guide/guide.page';
import {SharePopoverComponent} from 'src/app/components/share-popover/share-popover.component';
import {environment} from 'src/environments/environment';
import {UtilitiesService} from 'src/app/services/utilities.service';
import {IUser} from 'src/app/models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {UserService} from 'src/app/services/user.service';
import {MailService} from 'src/app/services/mail.service';
import {ReportService} from 'src/app/services/report.service';
import {IReport} from 'src/app/models/report.model';
import {IAdviseFull, IAdviseFilter, ITopic} from '../posts/advises/models/advises.model';
import {AdviseService} from '../posts/advises/services/advises.service';
import {UserDataService} from '../user-data/Services/user-data.service';

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
    private authSvc: AuthenticationService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    private adviseSvc: AdviseService,
    private userDataService: UserDataService
  ) {

    this.route.paramMap.subscribe((params) => {
      this.idPerfil = params.get('id');
    });
  }

  ngOnInit() {
    this.getFeed();
    this.getUserDetail();
    this.ratings = [];
    this.bests = [];
  }

  async getUserDetail() {
    const {response} = await this.userDataService.getUserDetail(this.idPerfil);
    if (response) {
      this.user = {
        name: response.username,
        description: response.description,
        date: '12 April at 09.28 PM' // ToDo: Remove this hardcoded value
      };
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
      content: null
    };
    const {response, error} = await this.adviseSvc.list(filters);
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

}
