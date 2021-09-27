import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { OlvidarContrasenaPage } from '../olvidar-contrasena/olvidar-contrasena.page';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  
  redirect: string;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private utilities: UtilitiesService,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit() {
    this.loginImplicito();
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.redirect = this.activatedRoute.snapshot.paramMap.get('redirect'); 
  }

  submitForm() {
    this.utilities.showLoading();

    const formData = new FormData();
    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);
    formData.append('remember_me', '1');

    (this.api.login(formData, 'login', null, this.redirect)).subscribe(
      (res) => {        this.utilities.dismissLoading();},
      (err) => {
        console.log('ERROR', err);

        // credenciales incorrectas
        if (err.status === 401) {
          this.utilities.showToast('Los datos introducidos no son correctos');
        }
        // 422 (email no válido)
        else if (err.status === 422) {
          this.utilities.showToast(
            'El formato del email introducido no es correcto'
          );
        } else {
          this.utilities.showAlert(
            'Error al iniciar sesión',
            'Hubo un error al iniciar sesión. Inténtalo de nuevo más tarde'
          );
        }
        this.utilities.dismissLoading();
      }
    );
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  /**
   * Mostramos el modal para recuperar contraseña
   */
  async openModal() {
    const profileModal = await this.modalCtrl.create({
      component: OlvidarContrasenaPage,
    });
    return await profileModal.present();
  }

  /**
   * Open sign up page
   */
  openRegistro() {
    const route = ['registro'];
    if(this.redirect) route.push(this.redirect)
    this.router.navigate(route);
  }

  /**
   * Si hay datos guardados de usuario iniciamos directamente
   */
  public loginImplicito(): void {
    this.utilities.getUserData().then(async (userData) => {
      if (userData) {
        let loading = await this.loadingCtrl.create({
          message: 'Iniciando sesión...',
          duration: 1500,
        });

        await loading.present();
        await loading.onDidDismiss();
        this.api.emitUserLogged();
        this.router.navigate(['menu/todas']);
        this.utilities.setGuia('login');
      }
    });
  }
}
