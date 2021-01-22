import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-realizar-oferta',
  templateUrl: './realizar-oferta.page.html',
  styleUrls: ['./realizar-oferta.page.scss'],
})
export class RealizarOfertaPage implements OnInit {

  form: FormGroup;
  id_demanda: any;
  perfil: any;

  constructor( public navParams: NavParams,
               private modalCtrl: ModalController,
               private api: ApiService,
               private formBuilder: FormBuilder,
               private utilities: UtilitiesService ) { 

    this.id_demanda = navParams.get('id_demanda');

  }

  /**
   * Obtenemos el perfil e inicializamos el formulario
   */
  public ngOnInit(): void {
    this.obtenerPerfil();
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  /**
   * Cerrar el modal 
   */
  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Enviar la oferta al servidor
   */
  async submitForm() {
    let p = {
      nombre: this.form.get('nombre').value,
      descripcion: this.form.get('descripcion').value
    };
    try {
      if (this.comprobarCamposPerfil()) {

        (await this.api.realizarOferta(p.nombre, p.descripcion, this.id_demanda)).subscribe( resp => {
          
          this.utilities.showToast('Se ha realizado la oferta correctamente');
          this.closeModal();

        });
       
      } else {
        this.utilities.showToast('Debes rellenar los campos de tu perfil para realizar las ofertas');
      }
    } catch (err) {
      this.utilities.showToast('No se ha podido publicar la oferta');
      console.log("ERROR",err);
    }

  }

  /**
   * Comprobamos los campos del perfil para realizar la oferta
   */
  public comprobarCamposPerfil(): boolean {
    if (this.perfil.user.dni && this.perfil.user.telefono && this.perfil.user.direccion)
      return true;
    else
      return false;

  }

  /**
   * Obtenemos el perfil del servidor
   */
  async obtenerPerfil() {
    let perfil = await this.utilities.getUserData();
    console.log("PERFIL",perfil);
    (await this.api.obtenerPerfil(perfil.id)).subscribe( perfil => {

      this.perfil = perfil;
      console.log("PERFIL WS",this.perfil);


    });
  
  }

}
