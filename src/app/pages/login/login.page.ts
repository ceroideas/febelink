import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { OlvidarContrasenaPage } from '../olvidar-contrasena/olvidar-contrasena.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor( private formBuilder: FormBuilder,
               private api: ApiService,
               private utilities: UtilitiesService,
               public loadingCtrl: LoadingController,
               private modalCtrl: ModalController,
               private router: Router ) { }

  ngOnInit() {

    this.loginImplicito();
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  async submitForm() {

    this.utilities.showLoading();

    let params = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };

    ( await this.api.login( params )).subscribe( res => {

    },err => {
      console.log("ERROR",err);
      this.utilities.dismissLoading();
      // credenciales incorrectas
      if (err.status === 401) {
        this.utilities.showToast('Los datos introducidos no son correctos');
      }
      // 422 (email no válido)
      else if (err.status === 422) {
        this.utilities.showToast('El formato del email introducido no es correcto');
      }
      else {
        this.utilities.showAlert('Error al iniciar sesión', 'Hubo un error al iniciar sesión. Inténtalo de nuevo más tarde');
      }
    });

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
      component: OlvidarContrasenaPage
    });
    return await profileModal.present();

  }

  /**
   * Open sign up page
   */
  openRegistro() {

    this.router.navigate(['registro']);

  }

  /**
   * Si hay datos guardados de usuario iniciamos directamente
   */
  public loginImplicito():void {
    this.utilities.getUserData().then(async userData => {
      if (userData) {

        let loading = await this.loadingCtrl.create({
          message: 'Iniciando sesión...',
          duration: 1500
        });

        await loading.present();
        await loading.onDidDismiss();
        this.api.emitUserLogged();
        this.router.navigate(['tabs/tab1']);
        this.utilities.setGuia("login");

      }
    });
  }

}
