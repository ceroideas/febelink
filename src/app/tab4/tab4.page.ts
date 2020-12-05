import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    ModalController,
    AlertController,
    ActionSheetController,
    IonContent,
    PopoverController,
    Platform,
} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilitiesService } from '../services/utilities.service';
import { GuidePage } from '../pages/guide/guide.page';
import { SuscribirsePage } from '../pages/suscribirse/suscribirse.page';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { SharePopoverComponent } from '../components/share-popover/share-popover.component';
import { TermsPage } from '../pages/terms/terms.page';

@Component({
    selector: 'app-tab4',
    templateUrl: 'tab4.page.html',
    styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {
@ViewChild('barCanvas', {static: true}) barCanvas: ElementRef;
@ViewChild(IonContent, {static: false}) content: IonContent;

perfil: any;
opiniones: any;
total_opinions: any;
opinion_types: any;
form: FormGroup;
base64img: any;
demandas: any[] = [];
sectores: any[];
sectoresPerfil: any[] = [];
subSectoresPerfil: any[] = [];
subsectores: any[];
subscription: any;
subscription_details: any;
barChart: Chart;
provincia: any;
localidad: any;
provincias: any[] = [];
localidades: any[] = [];
loading: boolean = true;
max_bio: any = 15;
isNative: boolean = true;
inputpass1: String = '';
inputpass2: String = '';

constructor(
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router,
    private platform: Platform,
    private elementRef: ElementRef,
    private camera: Camera,
    private storage: Storage,
    private socialSharing: SocialSharing,
    public popoverController: PopoverController,
    private actionSheet: ActionSheetController
) {
    if (this.platform.is('cordova')) {
        this.isNative = true;
    } else {
        this.isNative = false;
    }

    this.subsectores = [];
}
//&& !this.inputpass1.trim().match(/[a-z]/i) && !this.inputpass1.trim().match(/\d/)
showHidePassMessages(){
if((this.inputpass1.trim().match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) || this.inputpass1.trim().length<=0) && (this.inputpass2.trim().match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) || this.inputpass2.trim().length<=0)){
  document.getElementById('savebtn').removeAttribute('disabled');
} else {
  document.getElementById('savebtn').setAttribute('disabled', 'disabled');
}
if(this.inputpass1.trim().match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) || this.inputpass1.trim().length<=0){
  document.getElementById('msgpass1').classList.add('hide');
} else {
      document.getElementById('msgpass1').classList.remove('hide');
    }

    if(this.inputpass2.trim().match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) || this.inputpass2.trim().length<=0){
      document.getElementById('msgpass2').classList.add('hide');
    } else {
      document.getElementById('msgpass2').classList.remove('hide');
    }
  }

  async ngOnInit() {}

  async ionViewWillEnter() {
    //await this.obtenerSectores();
    await this.loadSuscriptions();
    this.content.scrollToTop(1500);
  }

  initForm() {
    let value = 0;

    this.form = this.formBuilder.group({
      name: [this.perfil.name],
      telefono: [this.perfil.telefono],
      descripcion: [this.perfil.descripcion],
      direccion: [this.perfil.direccion],
      provincia: [this.provincia],
      localidad: [this.localidad],
      dni: [this.perfil.dni],
      sector: [this.sectoresPerfil],
      sub_sector: [this.subSectoresPerfil],
      email: [this.perfil.email],
      password: [''],
      passwordConfirmation: [''],
    });
    this.form.get('sector').valueChanges.subscribe((id) => {
      if (Number(id) !== 0) {
        if (value !== Number(id)) this.obtenerTodosSubSectores(Number(id));
        value = Number(id);
      }
    });
  }

  loadSuscriptions() {
    this.utilities.getUserSubscription().then(async (subscriptions) => {
      this.subscription = subscriptions != null ? subscriptions[0] : null;

      this.utilities
        .getUserSubscriptionDetails()
        .then((subscription_details) => {
          this.subscription_details = subscription_details;
          if (subscription_details !== null) {
            this.max_bio = this.subscription_details.max_bio;
          }
          this.obtenerPerfil();
        });
    });
  }

    async obtenerPerfil() {
        this.utilities.getUserData().then(async (data) => {
            this.perfil = data;

            if (this.perfil.logo) {
                if (
                    !this.perfil.logo.includes('http://') &&
                    !this.perfil.logo.includes('https://')
                )
                    this.perfil.logo =
                        'https://api.febelink.com/storage/' + this.perfil.logo;
            } else {
                this.perfil.logo =
                    'https://api.febelink.com/storage/' + this.perfil.avatar;
            }

            await this.obtenerSectoresPerfil();
            await this.obtenerSubSectoresPerfil();
            await this.obtenerProvincias();
            this.initForm();

            //this.form.get('first').setValue('some value');

            (await this.api.opinionesPerfil(data.reference)).subscribe((data) => {
                this.opiniones = data.opinions;
                this.total_opinions = data.total;
                this.opinion_types = data.types;

                this.displayOpnionsGraphics();
            });
            this.loading = false;
        });

        /*this.utilities.getUserSubscription().then( async subscriptions => {

          this.subscription = subscriptions != null ? subscriptions[0] : null;

          this.utilities.getUserSubscriptionDetails().then( subscription_details => {

            console.log("SUSCRIPTION DETAILS", subscription_details);

            this.subscription_details = subscription_details;

            this.obtenerSectoresPerfil();
            this.obtenerSubSectoresPerfil();

          });
        })*/
    }

    displayOpnionsGraphics() {
        if (this.total_opinions > 0) {
            this.barChart = new Chart(this.barCanvas.nativeElement, {
                type: 'horizontalBar',
                data: {
                    labels: this.opinion_types,
                    datasets: [
                        {
                            data: this.opiniones,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    drawTricks: false,
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                },
            });
        }
    }

    /**
     * Navegar a incio
     */
    public irAInicio(): void {
    }

    /**
     * Metido a mano campos para enviarlos al servidor
     */
    async submitForm() {
        let p: any;
        let response: any;

        p = {
            name: this.form.get('name').value,
            descripcion: this.form.get('descripcion').value,
            telefono: this.form.get('telefono').value,
            direccion: this.form.get('direccion').value,
            provincia: this.form.get('provincia').value,
            localidad: this.form.get('localidad').value,
            sector: this.form.get('sector').value,
            sub_sector: this.form.get('sub_sector').value,
            dni: this.form.get('dni').value,
            email: this.form.get('email').value,
            password: this.form.get('password').value,
            passwordConfirmation: this.form.get('passwordConfirmation').value,
        };

        if (p.password != null && p.password != '') {
            if (this.comprobarContraseña(p.password, p.passwordConfirmation)) {
                this.utilities.showLoading();

                (
                    await this.api.editarOfertanteYContra(
                        p.name,
                        p.email,
                        p.descripcion,
                        p.telefono,
                        p.direccion,
                        p.provincia,
                        p.localidad,
                        p.sector,
                        p.sub_sector,
                        p.dni,
                        this.base64img,
                        p.password
                    )
                ).subscribe((res) => {
                    console.log("correcto");
                    console.log(res.user.dni);
                    response = res;
                    var dniinput = document.getElementById('dninie') as HTMLInputElement;
                    dniinput.value=res.user.dni;
                    this.utilities.showToast(
                        'Se han producido los cambios correctamente'
                    );
                    this.utilities.saveUserData(p);
                    this.utilities.dismissLoading();
                },
                (err) => {
                  if (err.status === 422) {
                    let jsonError = err.error;
        
                    let arrayErrores = [];
        
                    for (let key in jsonError.errors) {
                      arrayErrores.push(jsonError.errors[key]);
                    }
        
                    // mergeamos los subarrays en uno solo
                    arrayErrores = [].concat.apply([], arrayErrores);
        
                    for (let i = 0; i < arrayErrores.length; i++) {
                      arrayErrores[i] = this.utilities.capitalizeFirstLetter(
                        arrayErrores[i]
                      );
                    }
        
                    let cadenaErrores = `<ul>`;
                    for (let error of arrayErrores) {
                      cadenaErrores += `<li>${error}</li>`;
                    }
                    cadenaErrores += `</ul>`;
        
                    this.utilities.showAlert(
                      'Error al editar los datos',
                      `Ocurrieron los siguientes errores: ${cadenaErrores}`
                    );
                    // }
                  }
                  this.utilities.dismissLoading();
                }
                );
            } else {
                this.utilities.showToast(
                    'Introduce correctamente la confirmación de contraseña'
                );
            }
        } else {
            this.utilities.showLoading();

            (
                await this.api.editarOfertante(
                    p.name,
                    p.email,
                    p.descripcion,
                    p.telefono,
                    p.direccion,
                    p.provincia,
                    p.localidad,
                    p.sector,
                    p.sub_sector,
                    p.dni,
                    this.base64img
                )
            ).subscribe(
                (res) => {
                    var dniinput = document.getElementById('dninie') as HTMLInputElement;
                    dniinput.value=res.user.dni;
                    this.utilities.showToast(
                        'Se han producido los cambios correctamente'
                    );
                    this.utilities.saveUserData(res.user);
                    this.utilities.dismissLoading();
                },
                (err) => {
                    console.log('ERROR', err);
                    // credenciales incorrectas
                    if (err.status === 422) {
                        console.log('ERR BODY', err.error);
                        //if (JSON.parse(err.error)) {
                        //this.utilities.showToast(JSON.parse(err.error));
                        //} else {

                        let jsonError = err.error;

                        let arrayErrores = [];

                        for (let key in jsonError.errors) {
                            arrayErrores.push(jsonError.errors[key]);
                        }

                        // mergeamos los subarrays en uno solo
                        arrayErrores = [].concat.apply([], arrayErrores);

                        for (let i = 0; i < arrayErrores.length; i++) {
                            arrayErrores[i] = this.utilities.capitalizeFirstLetter(
                                arrayErrores[i]
                            );
                        }

                        let cadenaErrores = `<ul>`;
                        for (let error of arrayErrores) {
                            cadenaErrores += `<li>${error}</li>`;
                        }
                        cadenaErrores += `</ul>`;

                        this.utilities.showAlert(
                            'Error al editar los datos',
                            `Ocurrieron los siguientes errores: ${cadenaErrores}`
                        );
                        // }
                    } else {
                        this.utilities.showAlert(
                            'Error al editar los datos',
                            'Comprueba que todos los campos están introducidos.'
                        );
                    }
                    //this.utilities.showAlert('Error al editar los datos', 'Comprueba que todos los campos están introducidos.');
                    this.utilities.dismissLoading();
                }
            );
        }
    }

    /**
     * selectFamily
     */
    public selectFamily() {
        if (this.subscription_details === null) {
            this.subscription_details = {
                max_families: 1,
            };
        } else {
            if (this.sectoresPerfil.length > this.subscription_details.max_families) {
                var firstThree = [];
                for (
                    let index = 0;
                    index < this.subscription_details.max_families;
                    index++
                ) {
                    firstThree[index] = this.sectoresPerfil[index];
                }
                this.sectoresPerfil = [];
                this.sectoresPerfil = firstThree;
                this.showSubscription(
                    'Solo puedes seleccionar ' +
                    this.subscription_details.max_families +
                    ' sectores con tu suscripción actual'
                );
            }
        }
    }

    public selectSubfamily() {
        if (this.subscription_details === null) {
            this.subscription_details = {
                max_subfamilies: 1,
            };
        } else {
            if (
                this.subSectoresPerfil.length >
                this.subscription_details.max_subfamilies
            ) {
                var firstThree = [];
                for (
                    let index = 0;
                    index < this.subscription_details.max_subfamilies;
                    index++
                ) {
                    firstThree[index] = this.subSectoresPerfil[index];
                }
                this.subSectoresPerfil = [];
                this.subSectoresPerfil = firstThree;
                this.showSubscription(
                    'Solo puedes seleccionar ' +
                    this.subscription_details.max_subfamilies +
                    ' subsectores con tu suscripción actual'
                );
            }
        }
    }

    public attachImage(): void {
        if (this.platform.is('cordova')) {
            this.attachImageNative();
        } else {
            this.attachImageWeb();
        }
    }

    /**
     * Cambiar imagen de perfil
     */
    public attachImageNative(): void {
        if (
            (Number(this.perfil.role_id) == 5 &&
                this.subscription != null &&
                this.subscription_details.profile_photo == 1) ||
            Number(this.perfil.role_id) == 4
        ) {
            const options: CameraOptions = {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                mediaType: this.camera.MediaType.PICTURE,
                encodingType: this.camera.EncodingType.JPEG,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: 1920,
                targetHeight: 1080,
                allowEdit: false,
            };
            this.camera
                .getPicture(options)
                .then((urlFoto) => {
                    this.base64img = 'data:image/jpeg;base64,' + urlFoto;
                })
                .catch((error) => {
                    this.utilities.showAlert('Error al obtener imagen', error);
                });
        } else {
            this.showSubscription(
                'Suscríbete a alguno de nuestros planes para poder cambiar la foto de perfil'
            );
        }
    }

    attachImageWeb(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (
                (Number(this.perfil.role_id) == 5 &&
                    this.subscription != null &&
                    this.subscription_details.profile_photo == 1) ||
                Number(this.perfil.role_id) == 4
            ) {
                let filePicker = this.elementRef.nativeElement.querySelector(
                    '.input-file-perfil'
                );

                if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
                    reject('No file selected.');
                    return;
                }
                const myFile = filePicker.files[0];

                if (myFile.size > 307200) {
                    this.utilities.showToast('Imágen demasiado grande, max. 300KB');
                    //reject('Image is too big (max. 300KB)');
                    return;
                }

                this.base64img = await this.convert(myFile);
            } else {
                this.showSubscription(
                    'Suscríbete a alguno de nuestros planes para poder cambiar la foto de perfil'
                );
            }

            resolve();
        });
    }

    private convert(myFile: File): Promise<string | ArrayBuffer> {
        return new Promise<string | ArrayBuffer>((resolve, reject) => {
            const fileReader = new FileReader();
            if (fileReader && myFile) {
                fileReader.readAsDataURL(myFile);
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
            } else {
                reject('No file provided');
            }
        });
    }

    async showSubscription(alert_message) {
        let alert = await this.alertCtrl.create({
            header: 'Mejora tu perfil',
            message: alert_message,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Suscribirse',
                    handler: async () => {
                        const suscribirseModal = await this.modalCtrl.create({
                            component: SuscribirsePage,
                        });

                        await suscribirseModal.present();
                        const {data} = await suscribirseModal.onWillDismiss();
                        this.obtenerPerfil();
                    },
                },
            ],
        });
        await alert.present();
    }

    /**
     * Navegación a la demanda
     * @param demanda
     */
    public detalleDemanda(demanda): void {
        this.router.navigate(['detalle-demanda'], {
            queryParams: {demanda: JSON.stringify(demanda)},
        });
    }

    /**
     * Método para cerrar sesión
     */
    async logout() {
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
                        this.storage.remove('userData').then(() => {
                            this.api.refreshTabs();
                            this.router.navigate(['menu/todas']);
                            //this.router.navigateByUrl('menu/todas');
                            this.utilities.showToast('Sesión cerrada con éxito');
                        });
                    },
                },
            ],
        });
        await alert.present();
    }


    async suspended_profile() {

        let alert = await this.alertCtrl.create({
            header: 'Deshabilitar cuenta',
            message: '¿Estás seguro de que deseas deshabilitar tu cuenta?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Deshabilitar',
                    handler: () => {

                        this.setSuspendedUser(this.perfil.id);

                        this.storage.remove('userData').then(() => {
                            this.api.refreshTabs();
                            this.router.navigate(['menu/todas']);
                            //this.router.navigateByUrl('menu/todas');
                            this.utilities.showToast('Cuenta deshabilitada con éxito');
                        });
                    },
                },
            ],
        });
        await alert.present();
    }

    async setSuspendedUser(user_id) {
        (await this.api.suspendedUser(user_id)).subscribe(
            (response) => {
                console.log(response)
            }
        );
    }

    /**
     * Comprobación de contraseñas
     * @param pass
     * @param confirm
     */
    public comprobarContraseña(pass, confirm): boolean {
        return pass == confirm;
    }

    /**
     * Obtenemos los sectores del usuario
     */
    async obtenerSectoresPerfil() {
        this.sectoresPerfil = [];

        (await this.api.obtenerSectoresPerfil(this.perfil.id)).subscribe(
            (response) => {
                for (let x of response) {
                    this.sectoresPerfil.push(x.id_sector);
                }

                setTimeout(() => {
                    this.form.get('sector').setValue(this.sectoresPerfil);
                }, 500);

                this.obtenerSectores();
            }
        );
    }

    async obtenerSubSectoresPerfil() {
        this.subSectoresPerfil = [];

        (await this.api.obtenerSubSectoresPerfil(this.perfil.id)).subscribe(
            (response) => {
                for (let x of response) {
                    this.obtenerSubSectores(x.id_sub_sector);
                    this.subSectoresPerfil.push(x.id_sub_sector);
                }

                setTimeout(() => {
                    this.form.get('sub_sector').setValue(this.subSectoresPerfil);
                }, 500);
            }
        );
    }

    /**
     * Obtenemos todos lo sectores del servidor
     */
    async obtenerSectores() {
        this.sectores = [];

        (await this.api.obtenerSectores()).subscribe((sectores) => {
            this.sectores = sectores;
        });
    }

    /**
     * Método para obtener los subsectores de un sector
     * @param id_sector
     */
    async obtenerSubSectores(id_sector, addToForm = false) {
        this.subsectores = [];

        (await this.api.obtenerSubSectores(id_sector)).subscribe((subsectores) => {
            this.subsectores = subsectores;
            if (addToForm) {
                if (this.subsectores.length > 0) {
                    this.form.patchValue({sub_sector: this.subsectores[0].id});
                }
            }
        });
    }

    async obtenerTodosSubSectores(ids_sector, addToForm = false) {
        this.subsectores = [];

        var subs_array = ids_sector.toString().split(',');

        for (const id_sector of subs_array) {
            (await this.api.obtenerSubSectores(id_sector)).subscribe((subs) => {
                for (const sub of subs) {
                    this.subsectores.push(sub);
                }

                if (addToForm) {
                    if (this.subsectores.length > 0) {
                        this.form.patchValue({sub_sector: this.subsectores[0].id});
                    }
                }
            });
        }
    }

    /**
     * Recommend profile outside or inside the app
     */
    async recommend(ev: any) {
        const actionSheet = await this.actionSheet.create({
            header: 'Elige donde quieres compartir',
            buttons: [
                {
                    text: 'Dentro de la aplicación',
                    role: 'destructive',
                    handler: () => {
                        this.recomendacionAlert();
                    },
                },
                {
                    text: 'Fuera de la aplicación',
                    handler: () => {
                        if (this.platform.is('cordova')) {
                            this.shareProfileNative();
                        } else {
                            this.shareProfileWeb(ev);
                        }
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    /**
     * Popup to recommend the profile
     */
    async recomendacionAlert() {
        let alert = await this.alertCtrl.create({
            header: 'Pedir Recomendación',
            subHeader: 'Escribe el email de un usuario',
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Email',
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data) => {
                    },
                },
                {
                    text: 'Enviar',
                    handler: (data) => {
                        this.enviarRecomendacion(data.email);
                    },
                },
            ],
        });
        await alert.present();
    }

    /**
     * Share the profile outside the app ( Native)
     */
    async shareProfileNative() {
        if (this.perfil.reference === undefined) {
            (await this.api.obtenerPerfil(this.perfil.id)).subscribe((aux) => {
                this.perfil = aux.user;
            });
        }

        let subject =
            this.perfil.name +
            ', de Febelink quiere que le des una valoración de su perfil!';
        let url = 'https://febelink.com/perfil-demandante/' + this.perfil.reference;
        let message = 'Febelink \n' + subject + ' \n';

        this.socialSharing.share(null, null, null, url);
    }

    /**
     * Share the profile outside the app ( Web)
     */
    async shareProfileWeb(ev: any) {
        if (this.perfil.reference === undefined) {
            (await this.api.obtenerPerfil(this.perfil.id)).subscribe((aux) => {
                this.perfil = aux.user;
            });
        }

        let subject =
            this.perfil.name +
            ', de Febelink quiere que le des una valoración de su perfil!';
        let url = 'https://febelink.com/perfil-demandante/' + this.perfil.reference;
        let message = 'Febelink \n' + subject + ' \n';

        const popover = await this.popoverController.create({
            component: SharePopoverComponent,
            event: ev,
            translucent: true,
            mode: 'ios',
            componentProps: {url: url, title: '', desc: message},
        });
        return await popover.present();
    }

    /**
     * Guardamos el perfil en el almacenamiento interno
     */
    async guardarPerfil() {
        (await this.api.obtenerPerfil(this.perfil.id)).subscribe((aux) => {
            this.perfil = aux.user;
            this.utilities.saveUserData(this.perfil);
        });
    }

    /**
     * Enviar notificación de recomendación a otro usuario
     * @param name
     */
    async enviarRecomendacion(name) {
        this.utilities.showLoading();
        (await this.api.existeUsuario(name)).subscribe(async (value) => {
            if (value) {
                let title =
                    this.perfil.name + ' de Febelink quiere que recomiendes su perfil!';
                let desc = 'Ve a su panel para ver sus valoraciones!';

                (
                    await this.api.enviarNotificacionPedirRecomendacion(title, desc, name)
                ).subscribe((resp) => {
                    this.utilities.showToast('Se ha enviado una notificación al usuario');
                });
            } else {
                this.utilities.showToast('No existe un usuario con ese email');
            }
            this.utilities.dismissLoading();
        });
    }

    public provinciasChange(event: {
        component: IonicSelectableComponent;
        value: any;
    }): void {
        this.localidades = [];
        this.provincia = event.value;
        this.localidad = null;
        this.obtenerLocalidades(event.value.id);
    }

    public localidadesChange(event: {
        component: IonicSelectableComponent;
        value: any;
    }): void {
        this.localidad = event.value;
    }

    async obtenerProvincias() {
        (await this.api.obtenerProvincias()).subscribe((provincias) => {
            this.provincias = provincias;
            if (this.perfil.province_id != null) {
                let prov = this.provincias.filter(
                    (x) => x.id == this.perfil.province_id
                );
                this.provincia = prov[0];
                //this.form.get('provincia').setValue(this.provincia);
                this.obtenerLocalidades(this.perfil.province_id);
            }
        });
    }

    async obtenerLocalidades(id_provincia) {
        (await this.api.obtenerLocalidades(id_provincia)).subscribe(
            (localidades) => {
                this.localidades = localidades;
                if (this.perfil.town_id != null) {
                    let loc = this.localidades.filter((x) => x.id == this.perfil.town_id);
                    this.localidad = loc[0];
                }
            }
        );
    }

    async openGuide() {
        const guideModal = await this.modalCtrl.create({
            component: GuidePage,
            cssClass: 'guide-modal',
        });
        return await guideModal.present();
    }

    home() {
        this.router.navigate(['menu/todas']);
    }

    /**
     * Modal para suscribirse
     */
    async suscribirse() {
        const suscribirseModal = await this.modalCtrl.create({
            component: SuscribirsePage,
        });

        await suscribirseModal.present();
    }

    /**
     * Modal para abrir terminos y condiciones
     */
    async termsModal() {
        const TermsModal = await this.modalCtrl.create({
            component: TermsPage,
        });

        await TermsModal.present();
    }

    /**
     * Navegar a la pantalla p
     * @param p
     */
    public irA(p: string): void {
        this.router.navigate([p]);
    }
}
