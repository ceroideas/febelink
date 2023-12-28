import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, Platform} from '@ionic/angular';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {UtilitiesService} from '../../services/utilities.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ILang, ILangDEFAULTS} from 'src/app/models/langs.model';
import {TranslateConfigService} from 'src/app/services/translate/translate-config.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  form: UntypedFormGroup;
  sectores: any;
  subsectores: any;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  passwordType2 = 'password';
  passwordIcon2 = 'eye-off';
  partialRegisterEmail: string;

  redirect: string;

  promoCode: string;

  constructor(
    public navCtrl: NavController,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router,
    private cookSvc: CookieService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateConfigService,
    public platform: Platform,
    private userService: UserService
  ) {
  }

  /**
   * Inicializamos el formulario
   */
  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.promoCode = params?.code;
      this.partialRegisterEmail = params?.email;
    });

    let formValidators;

    if (this.partialRegisterEmail) {
      formValidators = {
        password: ['', Validators.required],
        name: ['', Validators.required],
        sector: [''],
        sub_sector: [''],
        privacyConditions: [null, Validators.requiredTrue],
      };
    } else {
      formValidators = {
        email: ['', Validators.required],
        password: ['', Validators.required],
        name: ['', Validators.required],
        sector: [''],
        sub_sector: [''],
        privacyConditions: [null, Validators.requiredTrue],
      };
    }

    console.log('Validadores: ', formValidators);
    this.form = this.formBuilder.group(formValidators);

    this.redirect = this.activatedRoute.snapshot.paramMap.get('redirect');

    this.form.get('sector').valueChanges.subscribe((id) => {
      this.obtenerSubSectores(id);
    });
    this.obtenerSectores();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  /**
   * Obtenemos todos lo sectores del servidor
   */
  async obtenerSectores() {
    (await this.api.obtenerSectores()).subscribe((sectores) => {
      this.sectores = sectores;
    });
  }

  /**
   * Método para obtener los subsectores de un sector
   * @param idSector: Identifier of a sector
   */
  async obtenerSubSectores(idSector) {
    (await this.api.obtenerSubSectores(idSector)).subscribe((subsectores) => {
      this.subsectores = subsectores;
      this.form.patchValue({sub_sector: this.subsectores[0].id});
    });
  }

  /**
   * Navegar a la pantalla p
   * @param p: Destiny template URL segment
   */
  public irA(p: string): void {
    // this.navCtrl.push(p, {}, { animate: false });
    this.router.navigate([p], {queryParams: {animate: false}});
  }

  /**
   * Enviamos el registro al servidor
   */
  loginBeforeRegister(registrationPayload) {
    this.utilities.showLoading();

    const formData = new FormData();
    formData.append('email', registrationPayload.email);
    formData.append('password', registrationPayload.password);
    formData.append('remember_me', '1');

    this.api.login(formData, 'login', true, this.redirect).subscribe((res) => {
      this.utilities.dismissLoading();
      this.verifSent(registrationPayload);
    });
  }

  async submitForm() {
    console.log('Revisión: ', this.form.controls);
    if (this.form.valid) {
      await this.utilities.showLoading();

      const idRecommender: string = this.cookSvc.get('recommenderId');
      const lang = ((
        await ILangDEFAULTS.getCurrentLang(this.translateService)
      ) as ILang).lang;

      const registrationPayload = {
        ...(!this.partialRegisterEmail) && {email: this.form.get('email').value},
        password: this.form.get('password').value,
        password_confirmation: this.form.get('password').value,
        nick: this.form.get('name').value,
        sector: this.form.get('sector').value,
        sub_sector: this.form.get('sub_sector').value,
        lang,
        idRecommender,
        promoCode: this.promoCode,
      };

      if (this.partialRegisterEmail) {
        const {response, error} = await this.userService.finishPartialSignUp(
          this.partialRegisterEmail, this.form.get('name').value, this.form.get('password').value);

        if (response) {
          registrationPayload.email = this.partialRegisterEmail;
          this.loginBeforeRegister(registrationPayload);
        }
        if (error) {
          this.utilities.showAlert(
            this.translateService.instant('pages.registro.errors.title'),
            this.translateService.instant('pages.registro.errors.server')
          );
        }

        this.utilities.dismissLoading();
      } else {
        this.api.registro(registrationPayload).subscribe(
          (resp) => {
            this.loginBeforeRegister(registrationPayload);
            this.utilities.dismissLoading();
          },
          (err) => {
            this.utilities.dismissLoading();
            // credenciales incorrectas
            if (err.status === 422) {
              const jsonError = err.error;

              let arrayErrores = [];

              for (const key in jsonError.errors) {
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
              for (const error of arrayErrores) {
                cadenaErrores += `<li>${error}</li>`;
              }
              cadenaErrores += `</ul>`;

              this.utilities.showAlert(
                this.translateService.instant('pages.registro.errors.title'),
                this.translateService.instant('pages.registro.errors.list') +
                cadenaErrores
              );
            } else {
              this.utilities.showAlert(
                this.translateService.instant('pages.registro.errors.title'),
                this.translateService.instant('pages.registro.errors.server')
              );
            }
            this.utilities.dismissLoading();
          }
        );
      }
    } else {
      if (
        this.form.value.privacyConditions === null ||
        !this.form.value.privacyConditions
      ) {
        this.utilities.showToast(
          this.translateService.instant('pages.registro.errors.terms')
        );
      } else {
        this.utilities.showToast(
          this.translateService.instant('pages.registro.errors.fields')
        );
      }
    }
  }

  async verifSent(registrationPayload) {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('common.verif.email.sent'),
      subHeader: this.translateService.instant('common.verif.email.message', {
        email: registrationPayload.email,
      }),
      buttons: ['OK'],
    });

    await alert.present();
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

  login() {
    this.navegar('login');
  }
}
