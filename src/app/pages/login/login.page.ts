import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { OlvidarContrasenaPage } from '../olvidar-contrasena/olvidar-contrasena.page';
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

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
    private activatedRoute:ActivatedRoute,
    private translateService: TranslateConfigService
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

    const lang = ILangDEFAULTS.getCurrentLang( this.translateService ).lang;

    const formData = new FormData();
    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);
    formData.append('remember_me', '1');
    formData.append('lang', lang );

    
    (this.api.login(formData, 'login', null, this.redirect)).subscribe(
      (res) => {        this.utilities.dismissLoading();},
      (err) => {
        console.log('ERROR', err);

        // credenciales incorrectas
        if (err.status === 401) {
          this.utilities.showToast( this.translateService.instant( 'pages.login.errors.data' ));
        }
        // 422 (email no válido)
        else if (err.status === 422) {
          this.utilities.showToast(
            this.translateService.instant( 'pages.login.errors.email' )
          );
        } else {
          this.utilities.showAlert(
            this.translateService.instant( 'pages.login.errors.title' ),
            this.translateService.instant( 'pages.login.errors.message' )
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
          message: this.translateService.instant( 'pages.login.logging' ),
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
