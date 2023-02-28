import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';

@Component({
  selector: 'app-olvidar-contrasena',
  templateUrl: './olvidar-contrasena.page.html',
  styleUrls: ['./olvidar-contrasena.page.scss'],
})
export class OlvidarContrasenaPage implements OnInit {
  public form: UntypedFormGroup;
  public email: any;

  redirect: string;

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
    await this.utilities.showLoading();
    const email = this.form.get('email').value;
    try {
      let resp = await this.api.recuperarContraseña(
        email,
        (<ILang>await ILangDEFAULTS.getCurrentLang(this.translateService)).lang
      );

      this.utilities.showToast(
        'Su solicitud de restablecimiento de contraseña ha sido enviada correctamente.'
      );
    } catch (e) {
      this.utilities.showToast('Se ha producido un error');
      console.log(e);
    } finally {
      this.utilities.dismissLoading();
    }
  }
}
