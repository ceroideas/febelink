import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-editar-demanda',
  templateUrl: './editar-demanda.page.html',
  styleUrls: ['./editar-demanda.page.scss'],
})
export class EditarDemandaPage implements OnInit {

  form: FormGroup;
  srcFoto: any;
  base64img: any;
  demanda: any;
  sector: any;
  sectores: any;
  
  constructor( public navParams: NavParams,
               private modalCtrl: ModalController,
               private formBuilder: FormBuilder,
               private api: ApiService,
               private utilities: UtilitiesService,
               private camera: Camera,
               private sanitizer: DomSanitizer ) {

    this.demanda = navParams.get('demanda');
    this.sector = this.demanda.sector;

   }

  ngOnInit() {

    this.form = this.formBuilder.group({
      nombre: [''],
      ofertas_restantes: [''],
      descripcion: [''],
      sector: [''],
    });
    this.obtenerSectores();
    
  }
   /**
   * Cerramos el modal
   */
  public closeModal():void {
    this.modalCtrl.dismiss();
  }

  /**
   * Método para obtener los sectores del servidor
   */
  async obtenerSectores() {

    (await this.api.obtenerSectores()).subscribe( sectores => {

      this.sectores = sectores;
      for (let sector of this.sectores) {
        if (sector.id == this.demanda.sector) {
          this.sector = sector;
        }
      }
      
    });
  }

  /**
   * Método enviar la demanda al servidor
   */
  async submitForm() {
    let p = {
      id: this.demanda.id,
      nombre: this.form.get('nombre').value,
      descripcion: this.form.get('descripcion').value,
      sector: this.form.get('sector').value,
      ofertas_restantes: this.form.get('ofertas_restantes').value,
      file: this.base64img
    };
  
      this.utilities.showLoading();
     
      (await this.api.editarDemanda(p)).subscribe( resp => {

        this.utilities.dismissLoading();
        this.utilities.showToast('Se ha editado la demanda correctamente');
        this.closeModal();

      },err => {
        this.utilities.dismissLoading();
        this.utilities.showToast('Error al editar la demanda');
      });
    
  }

  /**
   * Método para adjuntar imagen a la demanda
   */
  public adjuntarImagen():void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1920,
      targetHeight: 1080,
      allowEdit: false
    }

    this.camera.getPicture(options).then((urlFoto) => {
      
      this.srcFoto = this.sanitizer.bypassSecurityTrustUrl(urlFoto);
      this.base64img = 'data:image/jpeg;base64,' + urlFoto;
      
    }).catch(error => {
      this.utilities.showAlert('Error al obtener imagen', error);
    })
  }

}
