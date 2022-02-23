import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { TranslateConfigService } from '../../../services/translate/translate-config.service';
import { ToastSvc } from './../../../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class FileService
{

    base64img: string
    maxSize: number = 307200

    constructor(
        private camera: Camera
        , private platform: Platform
        , private translateSvc: TranslateConfigService
        , private toastSvc: ToastSvc
    ){}

    

    public pickImg(
        filePicker?: HTMLInputElement, targetWidth: number = 1920, targetHeight: number = 1080
    ): Promise<string | ArrayBuffer> {
        if (this.platform.is('cordova'))
            return this.pickImgNative( targetWidth, targetHeight );
        
        return this.pickImgWeb( filePicker );
    }
  
    private pickImgNative(
        targetWidth: number = 1920, targetHeight: number = 1080
    ): Promise<string> {
        return new Promise( async resolve => {
            const options: CameraOptions =
            {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                mediaType: this.camera.MediaType.PICTURE,
                encodingType: this.camera.EncodingType.JPEG,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: targetWidth,
                targetHeight: targetHeight,
                allowEdit: true,
            };
            this.camera
                .getPicture( options )
                .then((urlFoto) =>
                {
                    resolve( 'data:image/jpeg;base64,' + urlFoto );
                })
                .catch((error) =>
                {
                    console.log( 'image.service. error', error )
                    this.toastSvc.show( 'tabs.tab4.errors.image', true )
                });
        })
    }

    private pickImgWeb( filePicker: HTMLInputElement ): Promise<string | ArrayBuffer> {
        return new Promise(async resolve => {
            if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
                this.toastSvc.show( 'tabs.tab4.errors.noFileSelected', true );
                return;
            }

            const file = filePicker.files[ 0 ];
            if ( file.size > this.maxSize ) {
                this.toastSvc.show( 'tabs.tab4.errors.imageMaxSize', true );
                return;
            }
    
            // base64img
            resolve( await this.convert( file ));
        });
    }

    public resetFileInput( filePicker: HTMLInputElement ) {
      filePicker.value = '';
    }
  
    public convert( file: File ): Promise<string | ArrayBuffer>
    {
        return new Promise<string | ArrayBuffer>((resolve, reject) =>
        {
            const fileReader = new FileReader();
            if ( fileReader && file )
            {
                fileReader.readAsDataURL( file );
                fileReader.onload = () => resolve( fileReader.result )
                fileReader.onerror = error =>
                    this.toastSvc.show( 'tabs.tab4.errors.noFileProvided', true )
            } else
            this.toastSvc.show( 'tabs.tab4.errors.noFileProvided', true );
        });
    }

    ab2st( ab: ArrayBuffer )
    {
        return !ab ? null : String.fromCharCode.apply(null, new Uint8Array( ab ));
    }

    str2ab( str: string )
    {
        return !str ? null : Uint8Array.from( str, x => x.charCodeAt(0));
    }

    img2str( img: ArrayBuffer | String )
    {
        return img instanceof ArrayBuffer ? this.ab2st( img ) : this.str2ab( img as string )
    }
}
