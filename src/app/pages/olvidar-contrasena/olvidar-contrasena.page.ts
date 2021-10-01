import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-olvidar-contrasena',
  templateUrl: './olvidar-contrasena.page.html',
  styleUrls: ['./olvidar-contrasena.page.scss'],
})
export class OlvidarContrasenaPage implements OnInit {

  public form: FormGroup;
  public email: any;

  constructor( private formBuilder: FormBuilder,
               private modalCtrl: ModalController,
               private utilities: UtilitiesService,
               private api: ApiService ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });

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
    const email = this.form.get('email').value
    try {
      let resp = await this.api.recuperarContraseña(email);
      console.log(resp);
      
      this.utilities.showToast(resp['status']);
    } catch (e) {
      this.utilities.showToast('Se ha producido un error');
      console.log(e);      
    } finally {
      this.utilities.dismissLoading();
    }
    
  }

}
