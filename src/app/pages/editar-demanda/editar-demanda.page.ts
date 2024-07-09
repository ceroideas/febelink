import { Component, ElementRef, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { ApiService } from './../../services/api.service';
import { UtilitiesService } from './../../services/utilities.service';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editar-demanda',
  templateUrl: './editar-demanda.page.html',
  styleUrls: ['./editar-demanda.page.scss'],
})
export class EditarDemandaPage implements OnInit {
  form: UntypedFormGroup | undefined;
  srcFoto: any;
  base64img: any;
  demanda: any;
  sector: any;
  sectores: any;

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    private utilities: UtilitiesService,
    // private camera: Camera,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private platform: Platform,
    private elementRef: ElementRef
  ) {
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
  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Método para obtener los sectores del servidor
   */
  async obtenerSectores() {
    (await this.api.obtenerSectores()).subscribe((sectores) => {
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
      nombre: this.form?.get('nombre')?.value,
      descripcion: this.form?.get('descripcion')?.value,
      sector: this.form?.get('sector')?.value,
      ofertas_restantes: this.form?.get('ofertas_restantes')?.value,
      file: this.base64img,
    };

    this.utilities.showLoading();

    (await this.api.editarDemanda(p)).subscribe(
      (resp) => {
        this.utilities.dismissLoading();
        this.utilities.showToast(
          this.translateService.instant(
            'pages.editDemand.messageSuccessEditDemand'
          )
        );
        this.closeModal();
      },
      (err) => {
        this.utilities.dismissLoading();
        this.utilities.showToast(
          this.translateService.instant(
            'pages.editDemand.messageErrorEditDemand'
          )
        );
      }
    );
  }

  /**
   * Método para adjuntar imagen a la demanda
   */
  public attachImage(): void {
    if (this.platform.is('cordova')) {
      this.attachImageNative();
    } else {
      this.attachImageWeb();
    }
  }

  /**
   * Cambiar imagen
   */
  public attachImageNative(): void {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    //   targetWidth: 1920,
    //   targetHeight: 1080,
    //   allowEdit: false,
    // };
    // this.camera
    //   .getPicture(options)
    //   .then((urlFoto) => {
    //     this.srcFoto = this.sanitizer.bypassSecurityTrustUrl(urlFoto);
    //     this.base64img = 'data:image/jpeg;base64,' + urlFoto;
    //   })
    //   .catch((error) => {
    //     this.utilities.showAlert(
    //       this.translateService.instant('tabs.tab4.errors.image'),
    //       error
    //     );
    //   });
  }

  attachImageWeb(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let filePicker =
        this.elementRef.nativeElement.querySelector('.input-file');

      if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
        reject(
          this.translateService.instant('tabs.tab4.errors.noFileSelected')
        );
        return;
      }
      const myFile = filePicker.files[0];

      if (myFile.size > 307200) {
        this.utilities.showToast(
          this.translateService.instant('tabs.tab4.errors.imageMaxSize', {
            max: '300mb',
          })
        );
        //reject('Image is too big (max. 300KB)');
        return;
      }

      this.base64img = await this.convert(myFile);
      resolve();
    });
  }

  private convert(myFile: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const fileReader = new FileReader();
      if (fileReader && myFile) {
        fileReader.readAsDataURL(myFile);
        fileReader.onload = () => {
          //@ts-ignore
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(
          this.translateService.instant('tabs.tab4.errors.noFileProvided')
        );
      }
    });
  }
}
