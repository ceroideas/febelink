import { WalletService } from './services/wallet/wallet.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Platform,
  AlertController,
  IonRouterOutlet,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { UtilitiesService } from './services/utilities.service';
import { ApiService } from './services/api.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { NavController } from '@ionic/angular';
import { TranslateConfigService } from './services/translate/translate-config.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from './services/authentication/authentication.service';
import { IUser } from './models/user.model';
import { SuscribirsePage } from './pages/suscribirse/suscribirse.page';
import { ISector, ISubSector } from './models/sector.model';
import { NotificationService } from './services/notification.service';
import { CryptoCurrency } from './models/wallet/currency.model';
import { Observable } from 'rxjs';
import { ILangDEFAULTS } from './models/langs.model';
import { Meta, Title } from '@angular/platform-browser';
import { FrogedService } from './services/froged.service';
import { ConsoleSvc } from './services/console.service';

const GENERAL_TITLE = 'Febelink | El buscador de servicios profesionales';
const GENERAL_DESC =
  'En Febelink encontrarás lo que estás buscando - Entra y encuentra rápidamente lo que buscas en el sector o categoría que necesites. Explora todas las ventajas que te ofrece Febelink para ayudarte en tu día a día.';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  public userSubscription: any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlets: IonRouterOutlet;

  public appPages = [
    // NOTE: Hidden for the time being until Stripe development is completed.
    /*
    {
        key: 'subscriptions',
        url: '',
        icon: 'calendar'
    }
    */
  ];
  currentUser: IUser;
  showOpinions = true;
  showWallets = true;
  userSector: ISector;
  userSubsector: ISubSector;
  userSubscriptionDetails = 'ninguno';
  userFeedback = [];
  userWallets: CryptoCurrency[] = [];

  constructor(
    public platform: Platform,
    private splashScreen: SplashScreen,
    private push: Push,
    private api: ApiService,
    private utilities: UtilitiesService,
    public alertCtrl: AlertController,
    private router: Router,
    private deeplinks: Deeplinks,
    private navCtrl: NavController,
    private translateService: TranslateConfigService,
    private storage: Storage,
    private menu: MenuController,
    public authenticationService: AuthenticationService,
    private modalCtrl: ModalController,
    private notificationSvc: NotificationService,
    private walletService: WalletService,
    private titleService: Title,
    private metaService: Meta,
    private frogedSvc: FrogedService,
    private consoleSvc: ConsoleSvc
  ) {
    this.router.events.subscribe(( e ) => {
      /* To Know in SCSS which url is currently opened */
      document.body.dataset.url = location.href;
    });
  }

  ngOnInit() {
    this.initializeApp();
    this.openCookieBanner();

    this.titleService.setTitle(GENERAL_TITLE);
    this.metaService.addTags([
      {
        name: 'keywords',
        content:
          'Febelink, FEBELINK, Servicios, Profesionales, Buscador, Encontrar, Contratar, Proveedor',
      },
      { name: 'description', content: GENERAL_DESC },
    ]);

    this.frogedSvc.track( 'public_key' );

    /* Show */
    this.consoleSvc.warning()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setupLanguage();
      this.platform.backButton.subscribe(() => {
        if (this.router.url === '' || this.router.url === '/menu/todas') {
          navigator['app'].exitApp();
        } else {
          this.navCtrl.back();
        }
      });

      if (this.platform.is('cordova')) {
        this.splashScreen.hide();
        this.initDeeplinks();
        this.router.navigate(['login']);
      }

      this.userSubscription = this.api.getUserLogged().subscribe((item) => {
        if (this.platform.is('cordova')) {
          this.pushSetup();
        }
      });
    });

    this.authenticationService.authenticationState.subscribe(async (state) => {
      if (state) {
        console.log('state', state);
        this.menu.enable(true);
        this.getUserInfo();
        this.notificationSvc.getUnreadNotificationsCount();
        const serviceRequest: Observable<any> =
          await this.walletService.getBalanceByUserId();
        
        this.userWallets = []; //Clear wallet just in case has another session info
        serviceRequest.subscribe((response) => {
          this.userWallets = response.data;
        });
      }
    });
    // this.loginImplicito();
  }

  /** Update User Data when Menu clicked */
  async onMenuOpen() {
    (await this.api.getUserData()).subscribe((userData: IUser) => {
      // In case of error
      if (!userData) return;

      this.currentUser = userData;

      // Update in storage
      this.utilities.saveUserData(userData);
    });
  }

  openCookieBanner() {
    let cc = window as any;
    cc.cookieconsent?.initialise({
      palette: {
        popup: {
          background: '#000000',
        },
        button: {
          background: '#000000',
          text: '#ffffff',
          border: '5px',
        },
      },
      theme: 'classic',
      content: {
        message:
          'Este sitio web utiliza cookies para que usted tenga la mejor experiencia de usuario. Si continúa navegando está dando su consentimiento para la aceptación de las mencionadas cookies y la aceptación de nuestra política de cookies, pinche el enlace para mayor información.',
        dismiss: 'Aceptar',
        link: 'Política de Cookies',
        href: 'cookie-policy',
      },
    });
  }

  async openCookiePolicy() {
    this.router.navigate(['cookie-policy']);
  }

  async setupLanguage() {
    const currentLanguage = await this.translateService.getLanguage();

    // Añadí esta linea porque sino no cargaba el archivo en.json de i18n
    // Y cuando cambiaba al lenguaje 'es' no encontrba los valores
    this.translateService.addLangs(ILangDEFAULTS.enUK.lang);

    this.translateService.setLanguage(currentLanguage);
  }

  backbutton() {
    console.log('backbutton');
    document.addEventListener('backbutton', () => {
      console.log('backbutton1');
      if (this.routerOutlets && this.routerOutlets.canGoBack()) {
        this.routerOutlets.pop();
      } else if (this.router.url === 'menu/todas') {
        navigator['app'].exitApp();
      }
    });
  }

  public initDeeplinks() {
    this.deeplinks
      .route({
        '/busqueda/:id/:name': 'detalle-demanda',
        '/busqueda/:id': 'detalle-demanda',
        '/perfil/:id/:name': 'perfil-demandante',
        '/menu/ofertas': 'ofertas',
        '/#/busqueda/:id/:name': 'detalle-demanda',
        '/#/busqueda/:id': 'detalle-demanda',
        '/#/perfil/:id/:name': 'perfil-demandante',
        '/#/menu/ofertas': 'ofertas',
      })
      .subscribe(
        (match) => {
          let id = match.$args.id;
          const name = match.$args.nick || match.$args.name;
          switch (match.$route) {
            case 'detalle-demanda': {
              id = Number(id);
              setTimeout(() => {
                const route: string[] = ['busqueda', id, name];
                if (name) route.push(name);
                this.router.navigate(route, {
                  queryParams: { id_demanda: id },
                });
              }, 500);
              break;
            }
            case 'perfil-demandante': {
              this.router.navigate(['perfil', id, name], {
                queryParams: { id_perfil: id },
              });
              break;
            }
            case 'ofertas': {
              this.router.navigate(['menu', 'ofertas']);
              break;
            }
          }
        },
        (nomatch) => {
          console.error("Got a deeplink that didn't match", nomatch);
          const path = nomatch.$link.fragment;
          const id = path.substring(path.lastIndexOf('/') + 1, path.length);
          const route = path.substring(
            path.lastIndexOf('#') + 2,
            path.lastIndexOf('/')
          );
          if (route === 'busqueda') {
            setTimeout(() => {
              this.router.navigate(['busqueda/' + id], {
                queryParams: { id_demanda: Number(id) },
              });
            }, 500);
          } else if (route === 'perfil-demandante') {
            setTimeout(() => {
              this.router.navigate(['perfil-demandante'], {
                queryParams: { id_perfil: id },
              });
            }, 500);
          }
        }
      );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public pushSetup(): void {
    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push
      .createChannel({
        id: 'testchannel1',
        description: 'My first test channel',
        // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
        importance: 3,
      })
      .then(() => console.log('Channel created'));

    const options: PushOptions = {
      android: {
        senderID: '41183692404',
        // By default the icon selected is app's icon:
        // https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/PAYLOAD.md#images
        // else you can specify by name, refering an icon inside res/drawable folder 
        // icon: 'notification', // this icon does not exist in drawable folder
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true',
        // senderID: '41183692404',
        // gcmSandbox: true,
      },
      windows: {},
    };
    // console.log('en el push setup');

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification) => {
      // console.log('en el notification');
      // console.log("NOTIFICACION DATA:", JSON.stringify(notification.additionalData));
      if (notification.additionalData.foreground) {
        if (notification.additionalData.apiData.id) {
          let id = notification.additionalData.apiData.id;
          this.pushAlert(notification.title, notification.message, id);
        } else {
          this.utilities.showAlert(notification.title, notification.message);
        }
      } else {
        if (notification.additionalData.apiData.id) {
          let id = notification.additionalData.apiData.id;
          this.router.navigate(['perfil-demandante'], {
            queryParams: { id_perfil: id, contacto: true },
          });
        }
      }
    });
    pushObject.on('registration').subscribe(async (registration) => {
      console.log('en el registration');
      console.log(JSON.stringify(registration));

      (
        await this.api.guardarTokenDeRegistro(registration.registrationId)
      ).subscribe(
        (response) => {
          console.log('response apiNotificaciones.guardarTokenDeRegistro = ');
          console.log(response);
        },
        (err) => {
          console.log('error apiNotificaciones.guardarTokenDeRegistro =');
          console.log(err);
        }
      );
    });
    pushObject
      .on('error')
      .subscribe((error) => console.log('Error with Push plugin' + error));
  }

  async pushAlert(title, message, id) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: message,
      buttons: [
        {
          text: 'Cerrar',
          handler: (data) => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Ver perfil',
          handler: (data) => {
            this.router.navigate(['perfil-demandante'], {
              queryParams: { id_perfil: id, contacto: true },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  public loginImplicito(): void {
    this.router.navigate(['menu/todas']);
  }

  /**
   * Método para cerrar sesión
   */

  async logout() {
    this.storage.remove('userData').then(async () => {
      await this.menu.enable(false);
      this.api.refreshTabs();
      this.router.navigate(['login']);
      this.authenticationService.logout();
      this.utilities.showToast('Sesión cerrada con éxito');
    });
    // let alert = await this.alertCtrl.create({
    //   header: 'Cerrar sesión',
    //   message: '¿Estás seguro de que deseas cerrar sesión?',
    //   buttons: [
    //     {
    //       text: 'Cancelar',
    //       role: 'cancel',
    //     },
    //     {
    //       text: 'Cerrar sesión',
    //       handler: () => {
    //       },
    //     },
    //   ],
    // });
    // await alert.present();
  }

  // TODO: Use state management library to simplify data collection.
  async getUserInfo() {
    await this.getUserData();
    await this.getUserSectorsAndSubsectors();
    await this.getUserSuscriptions();
    await this.getUserOpinions();

    this.notificationSvc.getUnreadNotificationsCount();
    this.api.getUnreadMessages();
  }

  async getUserData() {
    this.currentUser = { ...(await this.utilities.getUserData()) };
    if(  this.currentUser )
      this.frogedSvc.set( this.currentUser );
  }

  async getUserSectorsAndSubsectors() {
    const sectors: ISector[] = await (
      await this.api.obtenerSectores()
    ).toPromise();
    const userSectorsIds = await (
      await this.api.obtenerSectoresPerfil(this.currentUser.id)
    ).toPromise();
    const sectorId = userSectorsIds[0]?.id_sector;
    const subsectors: ISubSector[] = await (
      await this.api.obtenerSubSectores(sectorId)
    ).toPromise();
    const userSubsectorsIds = await (
      await this.api.obtenerSubSectoresPerfil(this.currentUser.id)
    ).toPromise();
    this.userSector = sectors.filter((sector) => sector.id === sectorId).pop();
    this.userSubsector = subsectors
      .filter(
        (subsector) => subsector.id === userSubsectorsIds[0].id_sub_sector
      )
      .pop();
  }

  async getUserSuscriptions() {
    const userSubscription = await this.utilities.getUserSubscription();
    if (userSubscription.length !== 0) {
      const userSubscriptionDetails =
        await this.utilities.getUserSubscriptionDetails();
      this.userSubscriptionDetails = userSubscriptionDetails?.name;
    }
  }

  async showSubscriptionsModal() {
    const suscribirseModal = await this.modalCtrl.create({
      component: SuscribirsePage,
    });
    await suscribirseModal.present();
  }

  async getUserOpinions() {
    const result = await (
      await this.api.opinionesPerfil(this.currentUser.reference)
    ).toPromise();
    this.userFeedback = [];
    result.opinions.forEach((opinion, index) => {
      this.userFeedback.push({ count: opinion, type: result.types[index] });
    });
  }

  goTo(route: string) {
    this.router.navigate([route]).then(() => this.menu.close());
  }

  onImgError(event) {
    event.target.src = 'https://api.febelink.com/storage/users/default.png';
  }

  public navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  async openPrivacyPolicy() {
    this.navegar('privacy-policy');
  }

  async openUseConditions() {
    this.navegar('use-conditions');
  }
}
