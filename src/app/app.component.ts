
import {CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { FirebaseApp, initializeApp } from "firebase/app";
import {CommonModule, DOCUMENT, Location, NgIf, isPlatformBrowser} from '@angular/common';
import { ConsoleSvc} from './services/console.service';
import { ApiService } from './services/api.service';
import { ISector, ISubSector } from './models/sector.model';
import { CryptoCurrency } from './models/wallet/currency.model';
import { IUser } from './models/user.model';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { TranslateConfigService } from './services/translate/translate-config.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ILangDEFAULTS } from './models/langs.model';


import {
  
    Platform,
    MenuController,
    NavController,
    AlertController,
  
  } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { NotificationService } from './services/notification.service';
import { WalletService } from './services/wallet/wallet.service';
import { UtilitiesService } from './services/utilities.service';
import { SharedModule } from './shared/shared.module';
import { ServicesService } from './pages/servicios/services/services.service';

// import { IonicStorageModule } from '@ionic/storage';
  
    const GENERAL_TITLE =
    'Febelink | El buscador universal de servicios profesionales';
    const GENERAL_DESC =
    'Febelink es el buscador universal de servicios profesionales, el sitio donde encontrar soluciones en una comunidad global. Tanto si necesitas asesorías, reformas, belleza y estética, salud o formación, hay un servicio para ti en Febelink. Busca, compara y compra en un clic.';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
      
        SharedModule,
       
      
    ],
    providers: [
    ],
    host: {ngSkipHydration: 'true'},
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})




export class AppComponent implements OnInit, OnDestroy {
  advertisement = false;
  currentYear = new Date().getFullYear();
  public userSubscription: any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  public visiblePro: boolean = false;

  public appPages = [
  ];
  currentUser: IUser | undefined;
  showOpinions = true;
  showWallets = true;
  userSector: ISector | undefined;
  userSubsector: ISubSector | undefined;
  userSubscriptionDetails = 'ninguno';
  userFeedback = [];
  userWallets: CryptoCurrency[] = [];
  
  onHome: boolean = true;

  firebaseApp: FirebaseApp;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject(DOCUMENT) private navigator: Navigator,
    
    private location: Location,
    public platform: Platform,
    // private push: Push,
    private api: ApiService,
    private utilities: UtilitiesService,
    public alertCtrl: AlertController,
    private navCtrl: NavController,
    private translateService: TranslateConfigService,
    
    // private storage: Storage,
    private menu: MenuController,
    public authenticationService: AuthenticationService,
    private notificationSvc: NotificationService,
    private walletService: WalletService,
    private consoleSvc: ConsoleSvc,
    private servicesSvc: ServicesService,
    
  ) {

    // Initialize Firebase
    this.firebaseApp = initializeApp(environment.FIREBASE_CONFIG);

    this.router.events.subscribe((e) => {
      /* To Know in SCSS which url is currently opened */
      if (this.document.body.dataset) {
        this.document.body.dataset['url'] = this.location.path();
      }

      if ( e instanceof NavigationEnd ) {
        const urlParts = e.url.split('/');
     
        this.onHome = (e.url === '/' || urlParts.includes('user')
        || urlParts.includes('services')
        || urlParts.includes('wallet') || 
        urlParts.includes('profile')|| urlParts.includes('subscriptions')
        || urlParts.includes('professions'));
      } 
    });
  }

  ngOnInit() {
    if ( isPlatformBrowser(this.platformId) ) {


      if ('serviceWorker' in navigator) {
        try {
          navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
            })
            .catch((error) => {
            });
        } catch (error) {
        }
      }

      // this.navigator.serviceWorker.register("firebase-messaging-sw.js");
      // this.displayAdvertisement();
      this.initializeApp();
      this.openCookieBanner();
  
      // this.frogedSvc.track('public_key');
  
      /* Show */
      this.consoleSvc.warning();

      document.getElementById('notificationButton')?.addEventListener('click', () =>{
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then((permission) => {
              this.handlePermission(permission);
            });
        } else {
            // You can now proceed to show notifications
        }
      });
    }



  
  }

  displayAdvertisement() {
    if (!sessionStorage.getItem('advertisement')) {
      setTimeout(() => {
        this.advertisement = true;
      }, 10000);
    }
  }

  gotoHome(){
    this.router.navigate(['/home']);
  }
  gotoCart(){
    this.router.navigate(['/cart']);
  }
  gotoChat(){
    this.router.navigate(['/chat']);
  }

  initializeApp() {

    if ( localStorage.getItem('accessTokenInfo') !== undefined && localStorage.getItem('accessTokenInfo') !== null){
      let accessTokenInfo = JSON.parse(JSON.stringify( localStorage.getItem('accessTokenInfo') ))
      sessionStorage.setItem('accessTokenInfo', accessTokenInfo) 
    }
    if ( localStorage.getItem('userData') !== undefined && localStorage.getItem('userData') !== null){
      let userData = JSON.parse(JSON.stringify( localStorage.getItem('userData') ))
      sessionStorage.setItem('userData', userData) 
      this.currentUser = userData;
      this.authenticationService.login()

    }

    this.platform.ready().then(() => {
      this.setupLanguage();
      this.platform.backButton.subscribe(() => {
        if (this.router.url === '' || this.router.url === '/listado') {
        //   navigator['app'].exitApp(); //TODO: NOE
        } else {
          this.navCtrl.back();
        }
      });

      // if (this.platform.is('cordova')) {
      //   // this.splashScreen.hide();
      //   this.initDeeplinks();
      //   this.router.navigate(['login']);
      // }
      this.pushSetupFunction();
      // this.pushSetup();
      // this.userSubscription = this.api.getUserLogged().subscribe((item) => {
      //   this.pushSetup();
      // });
    });
 



    this.authenticationService.authenticationState.subscribe(async (state) => {

     
      if (state) {
        this.menu.enable(true);
        this.getUserInfo();
        if (this.authenticationService.isAuthenticated()) {
          this.getMyProfessions();
        }
        this.notificationSvc.getUnreadNotificationsCount();
        const serviceRequest: Observable<any> =
          await this.walletService.getBalanceByUserId();

        this.userWallets = []; //Clear wallet just in case has another session info
        serviceRequest.subscribe((response: any) => {
          this.userWallets = response.data;
        });
      }
    });
  }

  /** Update User Data when Menu clicked */
  async onMenuOpen() {
    (await this.api.getUserData()).subscribe((userData: IUser) => {
      // In case of error
      if (!userData) {
        return;
      }

      this.currentUser = userData;


      // Update in storage
      this.utilities.saveUserData(userData);
    });
  }

  async getMyProfessions() {
    const { response } = await this.servicesSvc.userProfession();
    if (response.professions && response.professions.length > 0) {
      this.visiblePro = true;
    }
  }

  changeToProfesional() {
    this.visiblePro = !this.visiblePro;
  }

  openCookieBanner() {
    let cc = this.document.defaultView as any;
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
    // document.addEventListener('backbutton', () => {
    //   if (this.routerOutlets && this.routerOutlets.canGoBack()) {
    //     this.routerOutlets.pop();
    //   } else if (this.router.url === environment.HOME_PAGE) {
    //     // navigator['app'].exitApp(); //TODO: NOE
    //   }
    // });
  }

  public initDeeplinks() {
    // this.deeplinks
    //   .route({
    //     '/busqueda/:id/:name': 'detalle-demanda',
    //     '/busqueda/:id': 'detalle-demanda',
    //     '/perfil/:id/:name': 'perfil-demandante',
    //     '/menu/ofertas': 'ofertas',
    //     '/#/busqueda/:id/:name': 'detalle-demanda',
    //     '/#/busqueda/:id': 'detalle-demanda',
    //     '/#/perfil/:id/:name': 'perfil-demandante',
    //     '/#/menu/ofertas': 'ofertas',
    //   })
    //   .subscribe(
    //     (match: any) => {
    //       let id = match.$args.id;
    //       const name = match.$args.nick || match.$args.name;
    //       switch (match.$route) {
    //         case 'detalle-demanda': {
    //           id = Number(id);
    //           setTimeout(() => {
    //             const route: string[] = ['busqueda', id, name];
    //             if (name) {
    //               route.push(name);
    //             }
    //             this.router.navigate(route, {
    //               queryParams: {id_demanda: id},
    //             });
    //           }, 500);
    //           break;
    //         }
    //         case 'perfil-demandante': {
    //           this.router.navigate(['perfil', id, name], {
    //             queryParams: {id_perfil: id},
    //           });
    //           break;
    //         }
    //         case 'ofertas': {
    //           this.router.navigate(['menu', 'ofertas']);
    //           break;
    //         }
    //       }
    //     },
    //     (nomatch: any) => {
    //       console.error('Got a deeplink that didn\'t match', nomatch);
    //       const path = nomatch.$link.fragment;
    //       const id = path.substring(path.lastIndexOf('/') + 1, path.length);
    //       const route = path.substring(
    //         path.lastIndexOf('#') + 2,
    //         path.lastIndexOf('/')
    //       );
    //       if (route === 'busqueda') {
    //         setTimeout(() => {
    //           this.router.navigate(['busqueda/' + id], {
    //             queryParams: {id_demanda: Number(id)},
    //           });
    //         }, 500);
    //       } else if (route === 'perfil-demandante') {
    //         setTimeout(() => {
    //           this.router.navigate(['perfil-demandante'], {
    //             queryParams: {id_perfil: id},
    //           });
    //         }, 500);
    //       }
    //     }
    //   );
  }

  ngOnDestroy() {
    
    // this.userSubscription.unsubscribe();
  }



  handlePermission(permission: any) {
    if (permission === 'granted') {
      // Initialize Firebase Cloud Messaging and get a reference to the service
      const messaging = getMessaging(this.firebaseApp);

      getToken(messaging, { vapidKey: environment.FIREBASE_VAPID_KEY })
      .then(async (currentToken) => {
        // if (currentToken) {
          // Send the token to your server and update the UI if necessary
          await this.api.guardarTokenDeRegistro(currentToken)
        // }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });

      
      onMessage(messaging, (payload) => {
        if (   this.platform.is('ios')
          || this.platform.is('android')) {
          this.navigator.serviceWorker.ready.then((registration) => {
              //@ts-ignore
            registration.showNotification(payload.data?.title, {
              //@ts-ignore
              body: payload.data?.message,
              icon: "assets/icon/febicon.png" // Opcional: añadir un ícono a la notificación
            });
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });
        } else {
              //@ts-ignore
          const notification = new Notification(payload.data?.title, {
            //@ts-ignore
            body: payload.data?.message,
            icon: "assets/icon/febicon.png" // Opcional: añadir un ícono a la notificación
          });


        
          notification.onclick = (event) => {
            // Handle notification click event here
          };
        }
        
       
        
      });
    } else {
      console.log('Unable to get permission to notify.');
    }
  } 


  public pushSetupFunction(): void {
      // Intentar obtener permiso utilizando una promesa
      try {
        Notification.requestPermission()
        .then(permission => {
            this.handlePermission(permission);
        })
        .catch((error) => {
            console.error('Error al solicitar permiso de notificación:', error);
        });
      } catch (error) {
          if (error instanceof TypeError) {
            Notification.requestPermission((permission) => {
                this.handlePermission(permission);
            });
          } else {
              throw error;
          }
      }
  }

  public pushSetup(): void {
    
   
    Notification.requestPermission().then((permission) => {

      if (permission === 'granted') {
        // Initialize Firebase Cloud Messaging and get a reference to the service
        const messaging = getMessaging(this.firebaseApp);

        getToken(messaging, { vapidKey: environment.FIREBASE_VAPID_KEY })
        .then(async (currentToken) => {
          // if (currentToken) {
            // Send the token to your server and update the UI if necessary
            await this.api.guardarTokenDeRegistro(currentToken)
          // }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });

        
        onMessage(messaging, (payload) => {
          if (   this.platform.is('ios')
            || this.platform.is('android')) {
            this.navigator.serviceWorker.ready.then((registration) => {
                  //@ts-ignore
              registration.showNotification(payload.data?.title, {
                  //@ts-ignore
                body: payload.data?.message,
                icon: "assets/icon/febicon.png" // Opcional: añadir un ícono a la notificación
              });
            }).catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
            });
          } else {

                //@ts-ignore
            const notification = new Notification(payload.data?.title, {
                //@ts-ignore
              body: payload.data?.message,
              icon: "assets/icon/febicon.png" // Opcional: añadir un ícono a la notificación
            });
  
  
          
            notification.onclick = (event) => {
              // Handle notification click event here
            };
          }
          
         
          
        });
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }



  async pushAlert(title: string, message: string, id: number) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: message,
      buttons: [
        {
          text: 'Cerrar',
          handler: (data) => {
          },
        },
        {
          text: 'Ver perfil',
          handler: (data) => {
            this.router.navigate(['perfil-demandante'], {
              queryParams: {id_perfil: id, contacto: true},
            });
          },
        },
      ],
    });

    await alert.present();
  }

  public loginImplicito(): void {
    this.utilities.getUserData().then(async (userData) => {
      console.log(userData)
    if (userData) {
      this.router.navigate([environment.HOME_PAGE]);
    }
    window.location.reload();
   
    });
  }

  /**
   * Método para cerrar sesión
   */

  async logout() {
    //@ts-ignore
    //TODO: NOE
    // this.storage.remove('userData').then(async () => {
    //   this.currentUser = undefined;
    //   await this.menu.enable(false);
    //   this.api.refreshTabs();
    //   this.router.navigate(['login']);
    //   this.authenticationService.logout();
    //   this.utilities.showToast('Sesión cerrada con éxito');
    // });
    let alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.menu.close();
            sessionStorage.clear()
            localStorage.clear()
            window.location.href = 'home';
           


          },
        },
      ],
    });
    await alert.present();
  }

  // TODO: Use state management library to simplify data collection.
  async getUserInfo() {
    await this.getUserData();
    await this.getUserSectorsAndSubsectors();
    await this.getUserSuscriptions();
    await this.getUserOpinions();

    // this.notificationSvc.getUnreadNotificationsCount();
    this.api.getUnreadMessages();
  }

  async getUserData() {
    this.currentUser = {...(await this.utilities.getUserData())};
    /* if (this.currentUser) {
      this.frogedSvc.set(this.currentUser);
    } */
  }

  async getUserSectorsAndSubsectors() {
    const sectors: ISector[] = await (
      await this.api.obtenerSectores()
    ).toPromise();
    const userSectorsIds = await (
      await this.api.obtenerSectoresPerfil(this.currentUser?.id)
    ).toPromise();
    const sectorId = userSectorsIds[0]?.id_sector;
    const subsectors: ISubSector[] = await (
      await this.api.obtenerSubSectores(sectorId)
    ).toPromise();
    const userSubsectorsIds = await (
      await this.api.obtenerSubSectoresPerfil(this.currentUser?.id)
    ).toPromise();
    this.userSector = sectors.filter((sector) => sector.id === sectorId).pop();
    this.userSubsector = subsectors
      .filter(
        (subsector) => subsector.id === userSubsectorsIds[0]?.id_sub_sector
      )
      .pop();
  }

  async getUserSuscriptions() {
    const userSubscription = await this.utilities.getUserSubscription();
    
    if (userSubscription && userSubscription.length !== 0) {
      const userSubscriptionDetails =
        await this.utilities.getUserSubscriptionDetails();
      this.userSubscriptionDetails = userSubscriptionDetails?.name;
    }
  }

  async showSubscriptionsModal() {
    //TODO: NOE
    // const suscribirseModal = await this.modalCtrl.create({
    //   component: SuscribirsePage,
    // });
    // await suscribirseModal.present();
  }

  async getUserOpinions() {
    const result = await (
      await this.api.opinionesPerfil(this.currentUser?.reference)
    ).toPromise();
    this.userFeedback = [];
    //@ts-ignore
    result.opinions.forEach((opinion, index) => {
    //@ts-ignore
      this.userFeedback.push({count: opinion, type: result.types[index]});
    });
  }

  goTo(route: string) {
    this.router.navigate([route]).then(() => this.menu.close());
  }

  onImgError(event: any) {
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

  closeAdvertisement() {
    this.advertisement = false;

    sessionStorage.setItem('advertisement', 'true');
  }
}
