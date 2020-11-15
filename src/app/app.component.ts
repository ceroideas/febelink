import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Platform, AlertController, IonRouterOutlet} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {Push, PushObject, PushOptions} from '@ionic-native/push/ngx';
import {UtilitiesService} from './services/utilities.service';
import {ApiService} from './services/api.service';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {NavController} from '@ionic/angular';
import {JsonPipe} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    public userSubscription: any;
    lastTimeBackPress = 0;
    timePeriodToExit = 2000;
    @ViewChild(IonRouterOutlet, {static: false}) routerOutlets: IonRouterOutlet;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private push: Push,
        private api: ApiService,
        private utilities: UtilitiesService,
        public alertCtrl: AlertController,
        private router: Router,
        private deeplinks: Deeplinks,
        private navCtrl: NavController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
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
            }

            this.userSubscription = this.api.getUserLogged().subscribe((item) => {
                if (this.platform.is('cordova')) {
                    this.pushSetup();
                }
            });
        });
        // this.loginImplicito();
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
                '/demanda/:id': 'detalle-demanda',
                '/perfil-demandante/:id': 'perfil-demandante',
                '/#/demanda/:id': 'detalle-demanda',
                '/#/perfil-demandante/:id': 'perfil-demandante',
            })
            .subscribe(
                (match) => {
                    let id = match.$args.id;
                    if (match.$route === 'detalle-demanda') {
                        id = Number(id);
                        setTimeout(() => {
                            this.router.navigate(['demanda/' + id], {
                                queryParams: {id_demanda: id},
                            });
                        }, 500);
                    } else if (match.$route === 'perfil-demandante') {
                        this.router.navigate(['perfil-demandante/' + id], {
                            queryParams: {id_perfil: id},
                        });
                    }
                },
                (nomatch) => {
                    console.error("Got a deeplink that didn't match", nomatch);

                    let path = nomatch.$link.fragment;

                    let id = path.substring(path.lastIndexOf('/') + 1, path.length);

                    var route = path.substring(
                        path.lastIndexOf('#') + 2,
                        path.lastIndexOf('/')
                    );

                    if (route === 'demanda') {
                        setTimeout(() => {
                            this.router.navigate(['demanda/' + id], {
                                queryParams: {id_demanda: Number(id)},
                            });
                        }, 500);
                    } else if (route === 'perfil-demandante') {
                        setTimeout(() => {
                            this.router.navigate(['perfil-demandante'], {
                                queryParams: {id_perfil: id},
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
                icon: 'notification',
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true',
                //senderID: '41183692404',
                // gcmSandbox: true,
            },
            windows: {},
        };
        console.log('en el push setup');

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification) => {
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
                        queryParams: {id_perfil: id, contacto: true},
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
            .subscribe((error) => alert('Error with Push plugin' + error));
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
                            queryParams: {id_perfil: id, contacto: true},
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
}
