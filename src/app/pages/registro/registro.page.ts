import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { Router } from '@angular/router';
import { TermsPage } from '../terms/terms.page';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  form: FormGroup;
  sectores: any;
  subsectores: any;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  passwordType2 = 'password';
  passwordIcon2 = 'eye-off';

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private api: ApiService,
    private utilities: UtilitiesService,
    private router: Router,
    private cookSvc: CookieService
  ) {}

  /**
   * Inicializamos el formulario
   */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      sector: [''],
      sub_sector: [''],
      confirmPassword: ['', Validators.required],
      terminos: [null, Validators.requiredTrue],
    });

    this.form.get('sector').valueChanges.subscribe((id) => {
      this.obtenerSubSectores(id);
    });
    this.obtenerSectores();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowPassword2() {
    this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
    this.passwordIcon2 = this.passwordIcon2 === 'eye-off' ? 'eye' : 'eye-off';
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
      this.form.patchValue({ sub_sector: this.subsectores[0].id });
    });
  }

  /**
   * Navegar a la pantalla p
   * @param p: Destiny template URL segment
   */
  public irA(p: string): void {
    // this.navCtrl.push(p, {}, { animate: false });
    this.router.navigate([p], { queryParams: { animate: false } });
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

    this.api.login(formData, 'login', true).subscribe((res) => {
      this.utilities.dismissLoading();
    });
  }

  async submitForm() {
    if (this.form.valid) {
      await this.utilities.showLoading();

      const afiliated: string = this.cookSvc.get('recommenderId');

      const registrationPayload = {
        email: this.form.get('email').value,
        password: this.form.get('password').value,
        password_confirmation: this.form.get('confirmPassword').value,
        name: this.form.get('name').value,
        sector: this.form.get('sector').value,
        sub_sector: this.form.get('sub_sector').value,
        idRecommender,
      };

      console.log(registrationPayload);
      

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
            for (const error of arrayErrores) {
              cadenaErrores += `<li>${error}</li>`;
            }
            cadenaErrores += `</ul>`;

            this.utilities.showAlert(
              'Error al registrarse',
              `Ocurrieron los siguientes errores al registrarse: ${cadenaErrores}`
            );
          } else {
            this.utilities.showAlert(
              'Error al registrarse',
              'Hubo un error en el servidor al registrarse. Inténtalo de nuevo más tarde'
            );
          }
          this.utilities.dismissLoading();
        }
      );
    } else {
      if (this.form.value.terminos === null || !this.form.value.terminos) {
        this.utilities.showToast(
          'Tienes que aceptar los términos y condiciones'
        );
      } else {
        this.utilities.showToast('Tienes que insertar los campos obligatorios');
      }
    }
  }

  async openTerms() {
    const termsModal = await this.modalCtrl.create({
      component: TermsPage,
    });
    return await termsModal.present();
  }
}
