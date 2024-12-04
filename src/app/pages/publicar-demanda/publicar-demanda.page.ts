import { Component, OnInit, ElementRef } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-publicar-demanda',
  templateUrl: './publicar-demanda.page.html',
  styleUrls: ['./publicar-demanda.page.scss'],
})
export class PublicarDemandaPage implements OnInit {
  form: UntypedFormGroup;
  srcFoto: any;
  base64img: any;
  sectores: any[];
  subsectores: any[];
  perfil: any;
  sector: any;
  sectorId: any;
  isNative: boolean = true;

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    private platform: Platform,
    private utilities: UtilitiesService,
    private camera: Camera,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private authSvc: AuthenticationService
  ) {
    this.sectorId = navParams.get('sector');

    if (this.platform.is('cordova')) {
      this.isNative = true;
    } else {
      this.isNative = false;
    }
  }

  ngOnInit() {
    this.obtenerSectores();
    this.obtenerPerfil();
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      sector: ['', Validators.required],
      ofertas_restantes: [''],
      sub_sector: [''],
    });
    this.form.get('sector').valueChanges.subscribe((id) => {
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
    if (this.perfil !== null) {
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

        (
          await this.api.publicarDemanda(
            p.nombre,
            p.texto,
            p.sector,
            p.sub_sector,
            p.ofertas_restantes,
            this.base64img
          )
        ).subscribe(
          async (resp) => {
            console.log('Demanda publicada', resp);
            if (p.sector !== -1) {
              (
                await this.api.enviarNotificacionAOfertantes(
                  'Se ha realizado una demanda, mira en tu panel!',
                  'Titulo: ' + p.nombre + '\nDescripción: ' + p.texto,
                  p.sector,
                  p.sub_sector
                )
              ).subscribe((resp) => {
                console.log('Notificacion enviada correctamente');
              });
            }

            this.utilities.dismissLoading();
            this.utilities.showToast(
              'Se ha publicado la demanda correctamente'
            );
            this.closeModal();
          },
          (err) => {
            this.utilities.dismissLoading();
            this.utilities.showToast('Hubo un error al publicar la demanda');
          }
        );
      } else {
        this.utilities.showToast(
          'Debes rellenar los campos de tu perfil para realizar las demandas'
        );
      }

      /*} catch (err) {
        this.utilities.showToast('Hubo un error al publicar la demanda');
      }*/
      // this.utilities.dismissLoading();
    } else {
      this.closeModal();
      this.authSvc.userNeedsToRegister();
    }
  }

  public attachImage(): void {
    if (this.platform.is('cordova')) {
      this.attachImageNative();
    } else {
      this.attachImageWeb();
    }
  }

  /**
   * Adjuntar imagen a la demanda
   */
  public attachImageNative(): void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1920,
      targetHeight: 1080,
      allowEdit: false,
    };
    this.camera
      .getPicture(options)
      .then((urlFoto) => {
        this.srcFoto = this.sanitizer.bypassSecurityTrustUrl(urlFoto);
        this.base64img = 'data:image/jpeg;base64,' + urlFoto;
        console.log(urlFoto);
      })
      .catch((error) => {
        this.utilities.showAlert('Error al obtener imagen', error);
      });
  }

  /**
   * Attach image for web
   */

  attachImageWeb(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let filePicker = this.elementRef.nativeElement.querySelector(
        '.input-file-demandas'
      );

      if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
        reject('No file selected.');
        return;
      }
      const myFile = filePicker.files[0];

      if (myFile.size > 307200) {
        this.utilities.showToast('Imágen demasiado grande, max. 300KB');
        return;
      }

      this.base64img = await this.convert(myFile);
      console.log(`Your base64 image is ${this.base64img}`);

      this.srcFoto = true;

      resolve();
    });
  }

  private convert(myFile: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const fileReader = new FileReader();
      if (fileReader && myFile) {
        fileReader.readAsDataURL(myFile);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject('No file provided');
      }
    });
  }

  /**
   * Obtener sectores del servidor
   */
  async obtenerSectores() {
    (await this.api.obtenerSectores()).subscribe((sectores) => {
      this.sectores = sectores;
      this.sectores.push({ id: -1, nombre: 'Otros' });
      console.log('SECTORES', this.sectores);
      if (this.sectorId !== undefined) {
        this.sector = this.sectorId;
      } else {
        this.sector = 72;
      }
    });
  }

  /**
   * Obtener subsectores del servidor a partir de un id_sector
   * @param id_sector
   */
  async obtenerSubSectores(id_sector) {
    if (id_sector !== null) {
      (await this.api.obtenerSubSectores(id_sector)).subscribe(
        (subsectores) => {
          this.subsectores = subsectores;
          if (this.subsectores.length > 0)
            this.form.patchValue({ sub_sector: this.subsectores[0].id });
        }
      );
    }
  }

  /**
   * Comprobar que los campos están rellenados
   */
  public comprobarCamposPerfil(): boolean {
    console.log(this.perfil);
    if (
      this.perfil.user.dni &&
      this.perfil.user.telefono &&
      this.perfil.user.direccion
    )
      return true;
    else return false;
  }

  /**
   * Obtener el perfil del servidor
   */
  async obtenerPerfil() {
    this.utilities.getUserData().then(async (perfil) => {
      this.perfil = perfil;

      if (this.perfil !== null) {
        (await this.api.obtenerPerfil(perfil.reference)).subscribe((perfil) => {
          this.perfil = perfil;
          console.log(this.perfil);
        });
      }
    });
  }
}
