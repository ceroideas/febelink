import { TranslateConfigService } from './../../../services/translate/translate-config.service';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Platform } from '@ionic/angular';
import { FileMaxSize, FilePickType, IFile } from '../models/file.model';
import { ToastSvc } from './../../../services/toast.service';
import {
  File as FileCordova,
  FileEntry,
  IFile as IFileNGX,
} from '@awesome-cordova-plugins/file/ngx';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  base64img: string;
  maxSize: FileMaxSize = FileMaxSize.BLOB_MEDIUM;

  options: CameraOptions = {
    quality: 100,
    // destinationType: this.camera.DestinationType.FILE_URI,
    // mediaType: this.camera.MediaType.ALLMEDIA,
    destinationType: this.camera.DestinationType.DATA_URL,
    mediaType: this.camera.MediaType.PICTURE,
    encodingType: this.camera.EncodingType.JPEG,

    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 1920,
    targetHeight: 1080,
  };

  constructor(
    private camera: Camera,
    private platform: Platform,
    private toastSvc: ToastSvc,
    private translateSvc: TranslateConfigService,
    private fileCordova: FileCordova
  ) {}

  public pickImg(
    filePicker?: HTMLInputElement,
    maxSize?: FileMaxSize
  ): Promise<any> {
    this.maxSize = maxSize || this.maxSize;
    if (this.platform.is('cordova')) return this.pickMediaNative();

    return this.pickMediaWeb(filePicker);
  }

  private pickMediaNative(): Promise<IFile> {
    return new Promise(async (resolve) => {
      this.camera
        .getPicture(this.options)
        .then(async (media) => {
          const iFile = await this.getNativeDATA(media);
          // const iFile = await this.getNativeURI( media )

          if (!this.exceedsSize(iFile.file)) resolve(iFile);
        })
        .catch((error) => {
          console.log('image.service. error', error);
          this.toastSvc.show('tabs.tab4.errors.image', true);
        });
    });
  }

  private pickMediaWeb(filePicker: HTMLInputElement): Promise<IFile> {
    return new Promise(async (resolve) => {
      if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
        this.toastSvc.show('tabs.tab4.errors.noFileSelected', true);
        return;
      }

      const iFile: IFile = await this.convert(filePicker.files[0]);
      if (this.exceedsSize(iFile.src)) return;

      // base64img
      resolve(iFile);
    });
  }

  private async getNativeDATA(media: string): Promise<IFile> {
    const src = 'data:image/jpeg;base64,' + media;
    const iFile = {
      src: src,
      file: src,
    };
    return iFile;
  }

  private async getNativeURI(mediaURI: string): Promise<IFile> {
    const filePath = mediaURI.substr(0, mediaURI.lastIndexOf('/') + 1);
    const fileName = mediaURI.substr(
      mediaURI.lastIndexOf('/') + 1,
      mediaURI.lastIndexOf('?')
    );
    const ext = this.getExt(fileName);

    const src = window['Ionic']['WebView'].convertFileSrc(
      mediaURI?.includes('file://') ? mediaURI : 'file://' + mediaURI
    );

    const iFile: IFile = {
      src: src,
      file: await this.getNativeFile(mediaURI),
      format: this.isVideo(ext) ? FilePickType.VIDEO : FilePickType.IMAGE,
      ext: ext,
    };
    // console.log({ mediaURI, fileName, src })
    return iFile;
  }

  async getNativeFile(filePath: string): Promise<File> {
    // Get FileEntry from media path
    const fileEntry: FileEntry =
      (await this.fileCordova.resolveLocalFilesystemUrl(filePath)) as FileEntry;

    // Get File from FileEntry. Note that this file does not contain the actual file data yet.
    const cordovaFile: IFileNGX = await this.convertFileEntryToCvaFile(
      fileEntry
    );

    // Use FileReader on each object to populate it with the true file contents.
    return this.convertCvaToJsFile(cordovaFile);
  }

  private convertFileEntryToCvaFile(fileEntry: FileEntry): Promise<IFileNGX> {
    return new Promise<IFileNGX>((resolve, reject) => {
      fileEntry.file(resolve, reject);
    });
  }

  private convertCvaToJsFile(cvaFile: IFileNGX): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.error) reject(reader.error);
        else {
          const blob: any = new Blob([reader.result], { type: cvaFile.type });
          blob.lastModified = cvaFile.lastModified;
          blob.lastModifiedDate = cvaFile.lastModifiedDate;
          blob.name = cvaFile.name;
          resolve(blob as File);
        }
      };
      reader.readAsArrayBuffer(cvaFile);
    });
  }

  public resetFileInput(filePicker: HTMLInputElement) {
    filePicker.value = '';
  }

  public convert(file: File): Promise<IFile> {
    return new Promise<IFile>((resolve) => {
      const fileReader = new FileReader();
      if (fileReader && file) {
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>
          resolve({
            src: fileReader.result,
            file: file,
            format:
              file.type.indexOf('video') > -1
                ? FilePickType.VIDEO
                : FilePickType.IMAGE,
            ext: this.getExt(file.name),
          });
        fileReader.onerror = (error) =>
          this.toastSvc.show('tabs.tab4.errors.noFileProvided', true);
      } else this.toastSvc.show('tabs.tab4.errors.noFileProvided', true);
    });
  }

  public exceedsSize(file: File | string | ArrayBuffer): boolean {
    const size = file instanceof File ? file.size : JSON.stringify(file).length;
    if (size <= this.maxSize) return false;

    this.toastSvc.show(
      this.translateSvc.instant('tabs.tab4.errors.imageMaxSize', {
        max: this.maxSize / 1024 / 1024 + 'mb',
      })
    );
    return true;
  }

  ab2st(ab: ArrayBuffer) {
    return !ab ? null : String.fromCharCode.apply(null, new Uint8Array(ab));
  }

  str2ab(str: string) {
    return !str ? null : Uint8Array.from(str, (x) => x.charCodeAt(0));
  }

  img2str(img: ArrayBuffer | String) {
    return img instanceof ArrayBuffer
      ? this.ab2st(img)
      : this.str2ab(img as string);
  }

  isImage(ext: string): boolean {
    return (
      !ext ||
      [
        'avif',
        'gif',
        'jpg',
        'jpeg',
        'jfif',
        'pjpeg',
        'pjp',
        'png',
        'apng',
        'svg',
        'webp',
      ].includes((ext || '__').toLowerCase())
    );
  }

  isVideo(ext: string): boolean {
    return [
      'mp4',
      'quicktime',
      'mpeg',
      'mov',
      'avi',
      'ogg',
      'webm',
      'x-ms-wmv',
      'x-flv',
      'x-matroska',
      'x-msvideo',
      'x-dv',
    ].includes((ext || '__').toLowerCase());
  }

  getExt(fileName: string): string {
    return (fileName || '').split('.').pop();
  }

  getEnctype(fileName: string) {
    const ext: string = this.getExt(fileName);
    return (this.isVideo(ext) ? 'video/' : 'image/') + ext;
  }
}
