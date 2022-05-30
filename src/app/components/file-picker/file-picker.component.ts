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
  @Input() iFile: IFile = {};
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
  @Output() OnFile: EventEmitter<IFile> = new EventEmitter();

  isNative: boolean = false;

  @ViewChild('filePicker') filePicker: ElementRef;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  constructor(
    public mediaSvc: FileService,
    private platform: Platform,
    public domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.platform
      .ready()
      .then(() => (this.isNative = this.platform.is('cordova')));
  }

  clicks() {
    this.filePicker.nativeElement.click();
  }

  async pickMedia(filePicker) {
    if (this.OnClick) this.OnClick.emit(filePicker);
    this.iFile = await this.mediaSvc.pickImg(filePicker, this.maxSize);
    if (this.iFile) if (this.OnFile) this.OnFile.emit(this.iFile);
  }

  toggleVideo(event) {
    // event.nativeElement.play()
    this.videoPlayer.nativeElement.play();
  }
}
