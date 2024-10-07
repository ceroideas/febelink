import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {UtilitiesService} from '../../services/utilities.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController, Platform} from '@ionic/angular';
import {OlvidarContrasenaComponent} from '../olvidar-contrasena/olvidar-contrasena.component';
import {ILang, ILangDEFAULTS} from '../../models/langs.model';
import {TranslateConfigService} from '../../services/translate/translate-config.service';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../services/seo.service';
import { Title } from '@angular/platform-browser';
// import {environment} from 'src/environments/environment';


const GENERAL_TITLE = 'Febelink | Ofertas de servicios profesionales';
const GENERAL_DESC = 'Iniciar sesión en Febelink, el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: UntypedFormGroup | undefined;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  redirect: string | null = null;

  defaultTitle = 'Iniciar sesión';
  generalTitle = this.defaultTitle;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    private utilities: UtilitiesService,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateConfigService,
    public platform: Platform,
    private seoService: SeoService,
    private title: Title,
  ) {
  }

  ngOnInit() {
    this.loginImplicito();
    
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.redirect = this.activatedRoute.snapshot.paramMap.get('redirect');

    this.seoService.generateTags({title: GENERAL_TITLE, description: GENERAL_DESC});
    this.title.setTitle(this.defaultTitle);

  }

  async submitForm() {
    this.utilities.showLoading();

    const lang = (<ILang> (
      await ILangDEFAULTS.getCurrentLang(this.translateService)
    )).lang;

    const formData = new FormData();
    formData.append('email', this.form?.get('email')?.value);
    formData.append('password', this.form?.get('password')?.value);
    formData.append('remember_me', '1');
    formData.append('lang', lang);

    //@ts-ignore
    this.api.login(formData, 'login', null, this.redirect).subscribe(
      (res) => {
     
        this.utilities.dismissLoading();
      },
      (err) => {
        // credenciales incorrectas
        if (err.status === 401) {
          this.utilities.showToast(
            this.translateService.instant('pages.login.errors.data'),
            'danger'
          );
        }
        // 422 (email no válido)
        else if (err.status === 422) {
          this.utilities.showToast(
            this.translateService.instant('pages.login.errors.email'),
            'danger'
          );
        } else {
          this.utilities.showAlert(
            this.translateService.instant('pages.login.errors.title'),
            this.translateService.instant('pages.login.errors.message')
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
      component: OlvidarContrasenaComponent,
    });
    return await profileModal.present();
  }

  /**
   * Open sign up page
   */
  openRegistro() {
    const route = ['registro'];
    if (this.redirect) {
      route.push(this.redirect);
    }
    this.router.navigate(route);
  }

  /**
   * Open remember password page
   */
  openPassRemember() {
    const route = ['olvidar-contrasena'];
    if (this.redirect) {
      route.push(this.redirect);
    }
    this.router.navigate(route);
  }

  /**
   * Si hay datos guardados de usuario iniciamos directamente
   */
  public loginImplicito(): void {
    this.utilities.getUserData().then(async (userData) => {
      if (userData) {
        let loading = await this.loadingCtrl.create({
          message: 'Logging in...', // this.translateService.instant( 'pages.login.logging' ),
          duration: 1500,
        });

        await loading.present();
        await loading.onDidDismiss();
        this.api.emitUserLogged();
        this.router.navigate([environment.HOME_PAGE]);
        this.utilities.setGuia('login');
      }
    });
  }
}
