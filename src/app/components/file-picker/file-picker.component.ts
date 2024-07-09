import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import {
  FilePickType,
  FileElementType,
  IFile,
  FileMaxSize,
} from './models/file.model';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent implements OnInit {
  //@ts-ignore
  @Input() iFile: IFile;
  @Input() fallback: string = 'assets/icon/svg/nopic.svg';
  @Input() height: string = '100%';
  @Input() width: string = '100%';
  @Input() maxSize: FileMaxSize = FileMaxSize.BLOB_MEDIUM;
  @Input() styles: string = '';
  @Input() classes: string = '';
  classWH: string = 'w-social-media h-social-media pointer ';

  @Input() pickType: FilePickType = FilePickType.BOTH;
  pickTypes = FilePickType;
  @Input() elType: FileElementType = FileElementType.ION_IMG;
  elTypes = FileElementType;

  @Output() OnClick: EventEmitter<any> = new EventEmitter();
  @Output() OnFile: EventEmitter<any> = new EventEmitter();

  isNative: boolean = false;

  @ViewChild('filePicker') filePicker: ElementRef | undefined;
  @ViewChild('videoPlayer') videoPlayer: ElementRef | undefined;

  constructor(
    public mediaSvc: FileService,
    private platform: Platform,
    public domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
  }

  clicks() {
    this.filePicker?.nativeElement.click();
  }

  async pickMedia(filePicker: any) {
    if (this.OnClick) this.OnClick.emit(filePicker);
    this.iFile = await this.mediaSvc.pickImg(filePicker, this.maxSize);
    this.OnFile.emit(this.iFile);


    
  }

  readFile(){
    let srcUrl: string;

    if (this.iFile.src instanceof ArrayBuffer) {
        // Convert ArrayBuffer to Base64 string
        const uint8Array = new Uint8Array(this.iFile.src);
        const blob = new Blob([uint8Array]);
        srcUrl = URL.createObjectURL(blob);
    } else {
        // iFile.src is a string or undefined
        srcUrl = this.iFile.src ?? '';
    }

    return srcUrl
  }

  toggleVideo(event: any) {
    // event.nativeElement.play()
    this.videoPlayer?.nativeElement.play();
  }
}
