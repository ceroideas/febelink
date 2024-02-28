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
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {
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
   
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  
  

  async submitForm() {
    // this.api.login(formData, 'login', true, this.redirect).subscribe((res) => {
    //   this.utilities.dismissLoading();
    // });
  }

 

  
}
