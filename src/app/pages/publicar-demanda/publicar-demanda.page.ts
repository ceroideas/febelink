import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { SesionCtrlPage } from '../sesion-ctrl/sesion-ctrl.page';

@Component({
  selector: 'app-publicar-demanda',
  templateUrl: './publicar-demanda.page.html',
  styleUrls: ['./publicar-demanda.page.scss'],
})
export class PublicarDemandaPage implements OnInit {

  form: FormGroup;
  srcFoto: any;
  base64img: string;
  sectores: any[];
  subsectores: any[];
  perfil: any;
  sector: any;
  sectorId: any;

  constructor( public navParams: NavParams,
               private modalCtrl: ModalController,
               private formBuilder: FormBuilder,
               private api: ApiService,
               private utilities: UtilitiesService,
               private camera: Camera,
               private sanitizer: DomSanitizer ) {

    this.sectorId = navParams.get('sector');
    
   }

  ngOnInit() {

    this.obtenerSectores();
    this.obtenerPerfil();
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      sector: ['', Validators.required],
      ofertas_restantes: [''],
      sub_sector: ['']
    });
    this.form.get('sector').valueChanges.subscribe((id) => {
      console.log(id);
      this.obtenerSubSectores(id);
    });

  }

  /**
   * Cerramos el modal
   */
  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Enviamos la demanda al servidor
   */
  async submitForm() {

    if( this.perfil !== null) {

      let p = {
        nombre: this.form.get('nombre').value,
        texto: this.form.get('descripcion').value,
        sector: this.form.get('sector').value,
        sub_sector: this.form.get('sub_sector').value,
        ofertas_restantes: this.form.get('ofertas_restantes').value,
      };
     // try {
        //this.utilities.showLoading();
        if (this.comprobarCamposPerfil()) {
          
          this.utilities.showLoading();
          
          (await this.api.publicarDemanda(p.nombre, p.texto, p.sector, p.sub_sector, p.ofertas_restantes, this.base64img)).subscribe(async resp => {
            console.log("Demanda publicada",resp);
            if( p.sector!==-1 ) {
              (await this.api.enviarNotificacionAOfertantes('Se ha realizado una demanda, mira en tu panel!', 'Titulo: ' + p.nombre + '\nDescripción: ' + p.texto, p.sector, p.sub_sector)).subscribe( resp => {
                console.log("Notificacion enviada correctamente")
              });
            }
            
            this.utilities.dismissLoading();
            this.utilities.showToast('Se ha publicado la demanda correctamente');
            this.closeModal();
          },err => {
            this.utilities.dismissLoading();
            this.utilities.showToast('Hubo un error al publicar la demanda');
          });
  
        } else {
          this.utilities.showToast('Debes rellenar los campos de tu perfil para realizar las demandas');
        }
  
      /*} catch (err) {
        this.utilities.showToast('Hubo un error al publicar la demanda');
      }*/
     // this.utilities.dismissLoading();

    } else {

      this.closeModal();
      this.userRegister();

    }
    
  }

  /**
   * Adjuntar imagen a la demanda
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
      console.log(urlFoto);
    }).catch(error => {
      this.utilities.showAlert('Error al obtener imagen', error);
    })
  }

  /**
   * Obtener sectores del servidor
   */
  async obtenerSectores() {

    (await this.api.obtenerSectores()).subscribe( sectores => {

      this.sectores = sectores;
      this.sectores.push({id: -1, nombre: "Otros"});
      console.log("SECTORES",this.sectores);
      if(this.sectorId!==undefined) {
        this.sector = this.sectorId;
      } else{
        this.sector = 72;
      }
      
    });

  }

  /**
   * Obtener subsectores del servidor a partir de un id_sector
   * @param id_sector 
   */
  async obtenerSubSectores(id_sector) {

    if(id_sector!==null) {

      (await this.api.obtenerSubSectores(id_sector)).subscribe( subsectores => {

        this.subsectores = subsectores;
        if (this.subsectores.length > 0)
         this.form.patchValue({ sub_sector: this.subsectores[0].id });
  
      });

    }
    
  }

  /**
   * Comprobar que los campos están rellenados
   */
  public comprobarCamposPerfil():boolean {
    console.log(this.perfil)
    if (this.perfil.user.dni && this.perfil.user.telefono && this.perfil.user.direccion)
      return true;
    else
      return false;

  }

  /**
   * Obtener el perfil del servidor
   */
  async obtenerPerfil() {

    this.utilities.getUserData().then(async perfil => {

      this.perfil = perfil;

      if(this.perfil !== null) {

        (await this.api.obtenerPerfil(perfil.reference)).subscribe( perfil => {

          this.perfil = perfil;
          console.log(this.perfil);
        });

      }

    });
  }

  /**
   * Crear modal para registro de usuario
   */
  async userRegister() {

    const registerModal = await this.modalCtrl.create({
      component: SesionCtrlPage
    });

    await registerModal.present();
  }

}
