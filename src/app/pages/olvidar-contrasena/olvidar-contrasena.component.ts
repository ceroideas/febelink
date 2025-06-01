import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from '../../services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';
import { ILang, ILangDEFAULTS } from '../../models/langs.model';

@Component({
  selector: 'app-olvidar-contrasena',
  templateUrl: './olvidar-contrasena.component.html',
  styleUrls: ['./olvidar-contrasena.component.scss'],
})
export class OlvidarContrasenaComponent implements OnInit {
  public form: UntypedFormGroup | undefined;
  public email: any;

  redirect: string= "";

  homePage: string = "";

  loading: boolean = false;
  recoverySent: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilities: UtilitiesService,
    private api: ApiService,
    private translateService: TranslateConfigService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });
    //@ts-ignore
    this.redirect = this.activatedRoute.snapshot.paramMap.get('redirect');
  }

  /**
   * Open sign up page
   */
  openLogin() {
    const route = ['login'];
    if (this.redirect) route.push(this.redirect);
    this.router.navigate(route);
  }

  /**
   * Cerrar el modal
   */
  public closeModal() {
    this.modalCtrl.dismiss();
  }

  /**
   * Enviar la contraseña al servidor
   */
  async submitForm() {
    this.loading = true;
    const email = this.form?.get('email')?.value;
    try {
      let resp = await this.api.recuperarContraseña(
        email,
        (<ILang>await ILangDEFAULTS.getCurrentLang(this.translateService)).lang
      );

      this.utilities.showToast(
        'Su solicitud de restablecimiento de contraseña ha sido enviada correctamente.'
      );

      this.recoverySent = true;
    } catch (e) {
      this.utilities.showToast('Se ha producido un error');
      console.log("test ceroideas",e);
    } finally {
      this.loading = false;
    }
  }

  irA(value: any) {
    this.router.navigate([value]);
  };
}
