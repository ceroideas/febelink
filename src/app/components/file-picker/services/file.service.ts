import { TranslateConfigService } from './../../../services/translate/translate-config.service';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { FileMaxSize, FilePickType, IFile } from '../models/file.model';
import { ToastSvc } from './../../../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class FileService
{

    base64img: string
    maxSize: FileMaxSize = FileMaxSize.MAX_ALLOWED_PACKET

    constructor(
        private camera: Camera
        , private platform: Platform
        , private toastSvc: ToastSvc
        , private translateSvc: TranslateConfigService
    ){}

    public pickImg(
        filePicker?: HTMLInputElement
        , maxSize?: FileMaxSize
        , targetWidth: number = 1920, targetHeight: number = 1080
    ): Promise<any> {
        this.maxSize = maxSize|| this.maxSize
        if (this.platform.is('cordova'))
            return this.pickMediaNative( targetWidth, targetHeight );
        
        return this.pickMediaWeb( filePicker );
    }
  
    private pickMediaNative(
        targetWidth: number = 1920, targetHeight: number = 1080
    ): Promise<IFile> {
        return new Promise( async resolve => {
            const options: CameraOptions =
            {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                mediaType: this.camera.MediaType.ALLMEDIA,
                // encodingType: this.camera.EncodingType.JPEG,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: targetWidth,
                targetHeight: targetHeight,
                allowEdit: true,
            };
            this.camera
                .getPicture( options )
                .then((urlFoto) =>
                {
                    const src = 'data:image/jpeg;base64,' + urlFoto
                    resolve({ src, file: src });
                })
                .catch((error) =>
                {
                    console.log( 'image.service. error', error )
                    this.toastSvc.show( 'tabs.tab4.errors.image', true )
                });
        })
    }

    private pickMediaWeb( filePicker: HTMLInputElement ): Promise<IFile> {
        return new Promise(async resolve => {
            if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
                this.toastSvc.show( 'tabs.tab4.errors.noFileSelected', true );
                return;
            }

            const iFile: IFile = await this.convert( filePicker.files[ 0 ] )
            if( this.exceedsSize( iFile.src )) return
    
            // base64img
            resolve( iFile );
        });
    }

    public resetFileInput( filePicker: HTMLInputElement ) {
      filePicker.value = '';
    }
  
    public convert( file: File ): Promise<IFile>
    {
        return new Promise<IFile>( resolve =>
        {
            const fileReader = new FileReader();
            if ( fileReader && file )
            {

                fileReader.readAsDataURL( file );
                fileReader.onload = () => resolve({
                    src: fileReader.result,
                    file: file,
                    format: file.type.indexOf('video')> -1 ? FilePickType.VIDEO : FilePickType.IMAGE
                })
                fileReader.onerror = error =>
                    this.toastSvc.show( 'tabs.tab4.errors.noFileProvided', true )
            } else
                this.toastSvc.show( 'tabs.tab4.errors.noFileProvided', true );
        });
    }

    public exceedsSize( file: File | string | ArrayBuffer ): boolean
    {
        const size = file instanceof File ? file.size : JSON.stringify( file ).length
        if ( size <= this.maxSize )
            return false
        
        this.toastSvc.show( this.translateSvc.instant(
            'tabs.tab4.errors.imageMaxSize', { max: ( this.maxSize / 1024 / 1024 ) + 'mb' }
        ));
        return true
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

    isImage( ext: string ): boolean
    {
        return [ 'png', 'jpg', 'jpeg', 'gif' ].includes( ( ext || '__' ).toLowerCase() )
    }

    isVideo( ext: string ): boolean
    {
        return [ 'mp4' ].includes( ( ext || '__' ).toLowerCase() )
    }
}
