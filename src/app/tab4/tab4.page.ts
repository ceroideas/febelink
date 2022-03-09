import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { SuscribirsePage } from '../pages/suscribirse/suscribirse.page';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { SharePopoverComponent } from '../components/share-popover/share-popover.component';
import { environment } from 'src/environments/environment';
import { TranslateConfigService } from '../services/translate/translate-config.service';
import { GeoPlacesApi } from '../services/geoplaces.service';
import { GeoPlacesModel } from '../models/geoplaces.model';
import {
  VerificationComponent,
  VerifWhich,
} from '../components/verification/verification.component';
import { KycPopSvc } from '../services/kyc/kyc.pop.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {
  @ViewChild('barCanvas', { static: true }) barCanvas: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  verifWhich = VerifWhich;

  currentYear = new Date().getFullYear();
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
  typeDNI: string = 'password';
  typeAddress: string = 'password';
  loading: boolean = true;
  max_bio: any = 50;
  isNative: boolean = true;
  inputpass1: String = '';
  inputpass2: String = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off';
  message: string;
  existsDNI;
  dniPrevio;
  emailPrevio;
  emailVerified: boolean = false;

  labelDoc: string;

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
    private actionSheet: ActionSheetController,
    private route: ActivatedRoute,
    private translateService: TranslateConfigService,
    private geoPlaces: GeoPlacesApi,
    private kycPopSvc: KycPopSvc
  ) {
    if (this.platform.is('cordova')) {
      this.isNative = true;
    } else {
      this.isNative = false;
    }

    this.subsectores = [];

    this.route.queryParams.subscribe((params) => {
      const navExtras = this.router.getCurrentNavigation().extras.state;
      if (navExtras) {
        this.message = navExtras.msg;
        // console.log(navExtras);
      }
    });
  }

  // To add verified KYC values ( if already done )
  setKYClabels() {
    this.labelDoc =
      this.translateService.instant('common.personal.id') +
      (!this.perfil?.doc_type
        ? ''
        : ' - ' +
          this.translateService.instant(
            'kyc.docTypes.' + this.perfil.doc_type
          ));
  }

  //&& !this.inputpass1.trim().match(/[a-z]/i) && !this.inputpass1.trim().match(/\d/)
  showHidePassMessages() {
    if (
      (this.inputpass1
        .trim()
        .match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#%^*()_\-=+\[\]{};:,.?/]{8,}$/
        ) ||
        this.inputpass1.trim().length <= 0) &&
      (this.inputpass2
        .trim()
        .match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#%^*()_\-=+\[\]{};:,.?/]{8,}$/
        ) ||
        this.inputpass2.trim().length <= 0)
    ) {
      document.getElementById('savebtn').removeAttribute('disabled');
    } else {
      document.getElementById('savebtn').setAttribute('disabled', 'disabled');
    }
    if (
      this.inputpass1
        .trim()
        .match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#%^*()_\-=+\[\]{};:,.?/]{8,}$/
        ) ||
      this.inputpass1.trim().length <= 0
    ) {
      document.getElementById('msgpass1').classList.add('hide');
      document.getElementById('msgpass3').classList.add('hide');
    } else {
      document.getElementById('msgpass1').classList.remove('hide');
      document.getElementById('msgpass3').classList.remove('hide');
    }

    if (
      this.inputpass2
        .trim()
        .match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#%^*()_\-=+\[\]{};:,.?/]{8,}$/
        ) ||
      this.inputpass2.trim().length <= 0
    ) {
      document.getElementById('msgpass2').classList.add('hide');
      document.getElementById('msgpass4').classList.add('hide');
    } else {
      document.getElementById('msgpass2').classList.remove('hide');
      document.getElementById('msgpass4').classList.remove('hide');
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowPassword2() {
    this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
    this.passwordIcon2 = this.passwordIcon2 === 'eye-off' ? 'eye' : 'eye-off';
  }

  async ngOnInit() {}

  async ionViewWillEnter() {
    //await this.obtenerSectores();
    this.loadSuscriptions();
    this.content.scrollToTop(1500);
  }

  initForm() {
    let value = 0;

    // Seteo inicial para que tenga GeoPlaces los valores guardados
    this.geoPlaces.setUserPlace(this.perfil);

    this.form = this.formBuilder.group({
      nick: [this.perfil.nick],
      telefono: [this.perfil.telefono],
      descripcion: [
        this.perfil.descripcion == null || this.perfil.descripcion == 'null'
          ? ''
          : this.perfil.descripcion,
      ],

      direccion: [this.geoPlaces.place.address],
      direccion_resto: [
        this.perfil.direccion_resto == null ||
        this.perfil.direccion_resto == 'null'
          ? ''
          : this.perfil.direccion_resto,
      ],

      country: [this.perfil.country],
      state: [this.perfil.state],
      department: [this.perfil.department],
      locality: [this.perfil.locality],
      place_id: [this.perfil.place_id],

      dni: [this.perfil.dni],
      link_url: [this.perfil.link_url],
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
      this.setKYClabels();

      if (this.perfil.logo) {
        if (
          !this.perfil.logo.includes('http://') &&
          !this.perfil.logo.includes('https://')
        )
          this.perfil.logo = `${environment.baseWebUrl}storage/${this.perfil.logo}`;
      } else {
        this.perfil.logo = `${environment.baseWebUrl}storage/${this.perfil.avatar}`;
      }

      await this.obtenerSectoresPerfil();
      await this.obtenerSubSectoresPerfil();
      this.initForm();
      this.dniPrevio = this.perfil.dni;
      this.emailPrevio = this.perfil.email;
      this.emailVerified = this.isEmailVerified();
      //this.form.get('first').setValue('some value');

      (await this.api.opinionesPerfil(data.reference)).subscribe((data) => {
        this.opiniones = data.opinions;
        this.total_opinions = data.total;
        this.opinion_types = data.types;

        this.displayOpnionsGraphics();

        const direccion_desktop =
          this.elementRef.nativeElement.querySelector('#direccion_desktop');
        const direccion_mobile =
          this.elementRef.nativeElement.querySelector('#direccion_mobile');
        this.geoPlaces
          .OnResponse((place: GeoPlacesModel) => {})
          .OnError((err) => {})
          .init(direccion_desktop, direccion_mobile);
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
      // Extra control just in case that element is not declared yet
      let barCanvasNativeEl;
      if (this.barCanvas === null || this.barCanvas === undefined) {
        barCanvasNativeEl =
          this.elementRef.nativeElement.querySelector('#barCanvas');
      } else barCanvasNativeEl = this.barCanvas.nativeElement;

      this.barChart = new Chart(barCanvasNativeEl, {
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
  public irAInicio(): void {}

  /**
   * Verify Email and KYC Data before submit
   * ToDo: KYC
   */
  verifyToSubmit() {
    const onVerificationDone = (hasError: boolean, verifSent: boolean) => {
      if (hasError) return;

      if (verifSent)
        // Email controlled and saved on verification
        this.emailPrevio = this.form.get('email').value;

      this.submitForm();
    };
    this.verify(VerifWhich.Save, onVerificationDone);
  }
  /**
   * Metido a mano campos para enviarlos al servidor
   */
  async submitForm() {
    let p: any;
    let response: any;
    const place = this.geoPlaces.getPlaceSelected();

    const descripcion = this.form.get('descripcion').value;
    const direccion_resto = this.form.get('direccion_resto').value;

    p = {
      nick: this.form.get('nick').value,
      descripcion:
        descripcion == null || descripcion == 'null' ? '' : descripcion,
      telefono: this.form.get('telefono').value,

      direccion: !place ? '' : place.address,
      direccion_resto:
        direccion_resto == null || direccion_resto == 'null'
          ? ''
          : direccion_resto,

      country: !place ? '' : place.Country.short,
      state: !place ? '' : place.State.long,
      department: !place ? '' : place.Department.long,
      locality: !place ? '' : place.Locality.long,
      place_id: !place ? '' : place.place_id,

      sector: this.form.get('sector').value,
      sub_sector: this.form.get('sub_sector').value,
      dni: this.form.get('dni').value,
      email: this.form.get('email').value,
      link_url: this.form.get('link_url').value,
      password: this.form.get('password').value,
      passwordConfirmation: this.form.get('passwordConfirmation').value,
    };

    // ToDo: Refactor this
    if (p.password != null && p.password != '') {
      if (this.comprobarContraseña(p.password, p.passwordConfirmation)) {
        (await this.api.existeEmail(p.email)).subscribe(
          async (value) => {
            if (!value || p.email === this.emailPrevio) {
              if (
                p.dni === this.dniPrevio ||
                (p.dni != null && p.dni.trim() != '')
              ) {
                this.utilities.showLoading();
                (
                  await this.api.editarOfertanteYContra(
                    p.nick,
                    p.email,
                    p.descripcion,
                    p.telefono,

                    p.direccion,
                    p.direccion_resto,
                    p.country,
                    p.state,
                    p.department,
                    p.locality,
                    p.place_id,

                    p.sector,
                    p.sub_sector,
                    p.dni,
                    p.link_url,
                    this.base64img,
                    p.password
                  )
                ).subscribe(
                  (res) => {
                    if (
                      p.descripcion == '' ||
                      p.descripcion == 'null' ||
                      p.descripcion == null
                    ) {
                      res.user.descripcion = '';
                    }
                    if (
                      p.direccion == '' ||
                      p.direccion == 'null' ||
                      p.direccion == null
                    ) {
                      res.user.direccion = '';
                    }
                    if (
                      p.telefono == '' ||
                      p.telefono == 'null' ||
                      p.telefono == null
                    ) {
                      res.user.telefono = '';
                    }
                    response = res;
                    var dniinput = document.getElementById(
                      'dninie'
                    ) as HTMLInputElement;
                    dniinput.value = res.user.dni;
                    this.utilities.showToast(
                      this.translateService.instant('tabs.tab4.done')
                    );
                    this.dniPrevio = p.dni;

                    // Email has changed, need to verify it
                    if (this.emailPrevio != p.email) {
                      this.perfil.email_verified_at = null;
                      this.emailVerified = false;
                    }
                    this.emailPrevio = p.email;

                    this.utilities.saveUserData(res.user);
                    this.utilities.dismissLoading();

                    // Para actualizar la imagen en el menú cuando haya seleccionado en perfil
                    (
                      document.getElementById('menuImg') as HTMLImageElement
                    ).src = this.base64img;
                  },
                  (err) => {
                    if (err.status === 422) {
                      let arrayErrores = [];
                      if (err.error.nombre == false) {
                        arrayErrores.push(
                          this.translateService.instant('tabs.tab4.errors.name')
                        );
                      }
                      if (err.error.email == false) {
                        arrayErrores.push(
                          this.translateService.instant('tabs.tab4.errors.mail')
                        );
                      }
                      //Check phone number
                      if (err.error.vTelefono == false) {
                        arrayErrores.push(
                          this.translateService.instant(
                            'tabs.tab4.errors.phone'
                          )
                        );
                      }
                      //Check DNI
                      if (err.error.vDNI == false) {
                        arrayErrores.push(
                          this.translateService.instant(
                            'tabs.tab4.errors.idFormat'
                          )
                        );
                      }

                      //Show all the errors
                      arrayErrores = [].concat.apply([], arrayErrores);

                      let cadenaErrores = `<ul>`;
                      for (let error of arrayErrores) {
                        cadenaErrores += `<li>${error}</li>`;
                      }
                      cadenaErrores += `</ul>`;

                      this.utilities.showAlert(
                        this.translateService.instant('tabs.tab4.errors.title'),
                        this.translateService.instant(
                          'tabs.tab4.errors.message'
                        ) + cadenaErrores
                      );
                    } else {
                      this.utilities.showAlert(
                        this.translateService.instant('tabs.tab4.errors.title'),
                        this.translateService.instant(
                          'tabs.tab4.errors.messageChk'
                        )
                      );
                    }
                    this.utilities.dismissLoading();
                  }
                );
              } else {
                this.utilities.showToast(
                  this.translateService.instant('tabs.tab4.errors.id')
                );
                this.form.controls.dni.setValue(this.dniPrevio);
              }
            } else {
              this.utilities.showToast(
                this.translateService.instant('tabs.tab4.errors.mailExists')
              );
              this.form.controls.email.setValue(this.emailPrevio);
            }
          },
          (err) => {
            if (p.email == '') {
              this.utilities.showToast(
                this.translateService.instant('tabs.tab4.errors.mailEmpty')
              );
              this.form.controls.email.setValue(this.emailPrevio);
            }
          }
        );
      } else {
        this.utilities.showToast(
          this.translateService.instant('tabs.tab4.errors.passMatch')
        );
      }
    } else {
      (await this.api.existeEmail(p.email)).subscribe(
        async (value) => {
          if (!value || p.email === this.emailPrevio) {
            if (p.dni != null && p.dni.trim() != '') {
              this.utilities.showLoading();

              (
                await this.api.editarOfertante(
                  p.nick,
                  p.email,
                  p.descripcion,
                  p.telefono,

                  p.direccion,
                  p.direccion_resto,
                  p.country,
                  p.state,
                  p.department,
                  p.locality,
                  p.place_id,

                  p.sector,
                  p.sub_sector,
                  p.dni,
                  p.link_url,
                  this.base64img
                )
              ).subscribe(
                (res) => {
                  if (
                    p.descripcion == '' ||
                    p.descripcion == 'null' ||
                    p.descripcion == null
                  ) {
                    res.user.descripcion = '';
                  }
                  if (
                    p.direccion == '' ||
                    p.direccion == 'null' ||
                    p.direccion == null
                  ) {
                    res.user.direccion = '';
                  }
                  if (
                    p.telefono == '' ||
                    p.telefono == 'null' ||
                    p.telefono == null
                  ) {
                    res.user.telefono = '';
                  }
                  response = res;
                  var dniinput = document.getElementById(
                    'dninie'
                  ) as HTMLInputElement;
                  dniinput.value = res.user.dni;
                  this.utilities.showToast(
                    this.translateService.instant('tabs.tab4.done')
                  );
                  this.dniPrevio = p.dni;

                  // Email has changed, need to verify it
                  if (this.emailPrevio != p.email) {
                    this.perfil.email_verified_at = null;
                    this.emailVerified = false;
                  }
                  this.emailPrevio = p.email;

                  this.utilities.saveUserData(res.user);
                  this.utilities.dismissLoading();

                  // Para actualizar la imagen en el menú cuando haya seleccionado en perfil
                  (document.getElementById('menuImg') as HTMLImageElement).src =
                    this.base64img;
                },
                (err) => {
                  if (err.status === 422) {
                    let arrayErrores = [];
                    if (err.error.nombre == false) {
                      arrayErrores.push(
                        this.translateService.instant('tabs.tab4.errors.name')
                      );
                    }
                    if (err.error.email == false) {
                      arrayErrores.push(
                        this.translateService.instant('tabs.tab4.errors.mail')
                      );
                    }
                    //Check phone number
                    if (err.error.vTelefono == false) {
                      arrayErrores.push(
                        this.translateService.instant('tabs.tab4.errors.phone')
                      );
                    }
                    //Check DNI
                    if (err.error.vDNI == false) {
                      arrayErrores.push(
                        this.translateService.instant(
                          'tabs.tab4.errors.idFormat'
                        )
                      );
                    }

                    //Show all the errors
                    arrayErrores = [].concat.apply([], arrayErrores);

                    let cadenaErrores = `<ul>`;
                    for (let error of arrayErrores) {
                      cadenaErrores += `<li>${error}</li>`;
                    }
                    cadenaErrores += `</ul>`;

                    this.utilities.showAlert(
                      this.translateService.instant('tabs.tab4.errors.title'),
                      this.translateService.instant(
                        'tabs.tab4.errors.message'
                      ) + cadenaErrores
                    );
                  } else {
                    this.utilities.showAlert(
                      this.translateService.instant('tabs.tab4.errors.title'),
                      this.translateService.instant(
                        'tabs.tab4.errors.messageChk'
                      )
                    );
                  }
                  //this.utilities.showAlert('Error al editar los datos', 'Comprueba que todos los campos están introducidos.');
                  this.utilities.dismissLoading();
                }
              );
            } else {
              this.utilities.showToast(
                this.translateService.instant('tabs.tab4.errors.id')
              );
              this.form.controls.dni.setValue(this.dniPrevio);
            }
          } else {
            this.utilities.showToast(
              this.translateService.instant('tabs.tab4.errors.mailExists')
            );
            this.form.controls.email.setValue(this.emailPrevio);
          }
        },
        (err) => {
          if (p.email == '') {
            this.utilities.showToast(
              this.translateService.instant('tabs.tab4.errors.mailEmpty')
            );
            this.form.controls.email.setValue(this.emailPrevio);
          }
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
          this.translateService.instant(
            'tabs.tab4.errors.limitSelectSectors_1'
          ) +
            this.subscription_details.max_families +
            this.translateService.instant(
              'tabs.tab4.errors.limitSelectSectors_2'
            )
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
          this.translateService.instant(
            'tabs.tab4.errors.limitSelectSectors_1'
          ) +
            this.subscription_details.max_subfamilies +
            this.translateService.instant(
              'tabs.tab4.errors.limitSelectSectors_2'
            )
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
        this.utilities.showAlert(
          this.translateService.instant('tabs.tab4.errors.image'),
          error
        );
      });
  }

  attachImageWeb(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let filePicker =
        this.elementRef.nativeElement.querySelector('.input-file-perfil');

      if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
        reject(
          this.translateService.instant('tabs.tab4.errors.noFileSelected')
        );
        return;
      }
      const myFile = filePicker.files[0];

      if (myFile.size > 307200) {
        this.utilities.showToast(
          this.translateService.instant('tabs.tab4.errors.imageMaxSize', { max: '300mb' })
        );
        //reject('Image is too big (max. 300KB)');
        return;
      }

      this.base64img = await this.convert(myFile);
      resolve();
    });
  }

  private resetFileInput() {
    let filePicker =
      this.elementRef.nativeElement.querySelector('.input-file-perfil');
    filePicker.value = '';
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
        reject(
          this.translateService.instant('tabs.tab4.errors.noFileProvided')
        );
      }
    });
  }

  async showSubscription(alert_message?: string) {
    const suscribirseModal = await this.modalCtrl.create({
      component: SuscribirsePage,
    });

    if (alert_message) {
      let alert = await this.alertCtrl.create({
        header: this.translateService.instant('tabs.tab4.alerts.improve'),
        message: alert_message,
        buttons: [
          {
            text: this.translateService.instant('common.buttons.cancel'),
            role: 'cancel',
          },
          {
            text: this.translateService.instant('common.labelSubsribe'),
            handler: async () => {
              await this.showSubscriptionsModal(suscribirseModal);
            },
          },
        ],
      });
      await alert.present();
    } else {
      await this.showSubscriptionsModal(suscribirseModal);
    }
  }

  private async showSubscriptionsModal(suscribirseModal: HTMLIonModalElement) {
    await suscribirseModal.present();
    this.obtenerPerfil();
    suscribirseModal.onDidDismiss().then((response) => {
      if (response?.data?.subscriptionChanged) this.loadSuscriptions();
    });
  }

  /**
   * Navegación a la demanda
   * @param demanda
   */
  public detalleDemanda(demanda): void {
    this.router.navigate(['detalle-demanda'], {
      queryParams: { demanda: JSON.stringify(demanda) },
    });
  }

  async suspended_profile() {
    let alert = await this.alertCtrl.create({
      header: this.translateService.instant('tabs.tab4.labelDisable'),
      message: this.translateService.instant('tabs.tab4.labelDisableConfirm'),
      buttons: [
        {
          text: this.translateService.instant('common.buttons.cancel'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('tabs.tab4.buttonDisable'),
          handler: () => {
            this.setSuspendedUser(this.perfil.id);

            this.storage.remove('userData').then(() => {
              this.api.refreshTabs();
              this.router.navigate([ environment.HOME_PAGE ]);
              //this.router.navigateByUrl( environment.HOME_PAGE );
              this.utilities.showToast(
                this.translateService.instant('tabs.tab4.labelDisableConfirmed')
              );
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async setSuspendedUser(user_id) {
    (await this.api.suspendedUser(user_id)).subscribe((response) => {
      // console.log(response);
    });
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
          this.form.patchValue({ sub_sector: this.subsectores[0].id });
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
            this.form.patchValue({ sub_sector: this.subsectores[0].id });
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
      header: this.translateService.instant('tabs.tab4.alerts.chooseShare'),
      buttons: [
        {
          text: this.translateService.instant('tabs.tab4.alerts.shareInside'),
          role: 'destructive',
          handler: () => {
            this.recomendacionAlert();
          },
        },
        {
          text: this.translateService.instant('tabs.tab4.alerts.shareOutside'),
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
      header: this.translateService.instant('tabs.tab4.alerts.recommendation'),
      subHeader: this.translateService.instant('tabs.tab4.alerts.mail'),
      inputs: [
        {
          name: 'email',
          placeholder: this.translateService.instant('common.labelEmail'),
        },
      ],
      buttons: [
        {
          text: this.translateService.instant('common.buttons.cancel'),
          handler: (data) => {},
        },
        {
          text: this.translateService.instant('common.buttons.send'),
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
      this.perfil.nick +
      this.translateService.instant('tabs.tab4.errors.valorationFrom');
    let url = 'https://febelink.com/perfil/' + this.perfil.reference;
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
      this.perfil.nick +
      this.translateService.instant('tabs.tab4.valuation.from');
    let url = 'https://febelink.com/perfil/' + this.perfil.reference;
    let message = 'Febelink \n' + subject + ' \n';

    const popover = await this.popoverController.create({
      component: SharePopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: { url: url, title: '', desc: message },
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
          this.perfil.nick +
          this.translateService.instant('tabs.tab4.valuation.recommendation');
        let desc = this.translateService.instant('tabs.tab4.valuation.panel');

        (
          await this.api.enviarNotificacionPedirRecomendacion(title, desc, name)
        ).subscribe((resp) => {
          this.utilities.showToast(
            this.translateService.instant('tabs.tab4.valuation.notif')
          );
        });
      } else {
        this.utilities.showToast(
          this.translateService.instant('tabs.tab4.valuation.noMailuser')
        );
      }
      this.utilities.dismissLoading();
    });
  }

  home() {
    this.router.navigate([ environment.HOME_PAGE ]);
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
   * When input email changed, verify it
   */
  public emailChanged(email) {
    if (this.hasEmailChanged(email)) this.emailVerified = false;
    else this.emailVerified = this.isEmailVerified();
  }

  /**
   * Check if mail is verified
   */
  isEmailVerified(): boolean {
    return (
      this.perfil?.email_verified_at !== null &&
      this.perfil?.email_verified_at !== ''
    );
  }

  /**
   * Check if mail has changed
   */
  hasEmailChanged(email: string = this.form.get('email').value): boolean {
    return email !== this.perfil?.email;
  }

  /**
   * Alert to Verify email
   */
  public async verify(which, onVerificationDone?: Function) {
    const email = this.form.get('email').value;
    if (email === null || email === '') {
      this.utilities.showToast(
        this.translateService.instant('tabs.tab4.errors.mailEmpty')
      );
      return;
    }

    if (!this.hasEmailChanged() && this.isEmailVerified()) {
      if (onVerificationDone) onVerificationDone(false, true);
      return;
    }

    const verif = await this.modalCtrl.create({
      component: VerificationComponent,
      componentProps: {
        which: which,
        id: this.perfil.id,
        email: email,
      },
      backdropDismiss: false,
      mode: 'md',
      cssClass: 'pop-yt',
    });

    verif.onDidDismiss().then((data) => {
      const hasError: boolean = data.data?.hasError;
      const verifSent: boolean =
        data.role !== 'backdrop' && data.data?.verifSent;

      if (onVerificationDone) onVerificationDone(hasError, verifSent);
    });

    await verif.present();
  }

  async verifyKYC() {
    if (await this.kycPopSvc.verify()) {
      this.perfil.kyc_verified_at = new Date().toLocaleString();
      this.utilities.saveUserData(this.perfil);
    }
  }

  verified(which: string) {
    let msg: string = '';
    switch (which) {
      case 'email':
        msg = 'common.verif.which.email';
        break;
      case 'kyc':
        msg = 'common.verif.which.kyc';
        break;
    }

    this.utilities.showToast(this.translateService.instant(msg));
  }
}
