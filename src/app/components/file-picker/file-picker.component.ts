import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FilePickType, FileElementType, IFile, FileMaxSize } from './models/file.model';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent implements OnInit {

  @Input() src: string | ArrayBuffer
  @Input() fallback: string = 'assets/icon/svg/nopic.svg'
  @Input() height: string = '100%'
  @Input() width: string = '100%'
  @Input() maxSize: FileMaxSize = FileMaxSize.MAX_ALLOWED_PACKET
  @Input() styles: string = ''
  @Input() classes: string = ''
  classWH: string = 'w-social-media h-social-media pointer '

  @Input() pickType: FilePickType = FilePickType.BOTH
    pickTypes = FilePickType
  @Input() elType: FileElementType = FileElementType.ION_IMG
    elTypes = FileElementType

  @Output() OnClick: EventEmitter<any> = new EventEmitter()
  @Output() OnFile: EventEmitter<IFile> = new EventEmitter()
  
  isNative: boolean = false

  @ViewChild( "filePicker" ) filePicker: ElementRef
  @ViewChild('videoPlayer') videoPlayer: ElementRef

  iFile: IFile = {}

  constructor(
      public mediaSvc: FileService
    , private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => this.isNative = this.platform.is( 'cordova' ))
  }

  ngOnChanges( changes: SimpleChanges ): void
  {
    if ( 'src' in changes) this.iFile.src = changes.src.currentValue
  }

  clicks()
  {
    this.filePicker.nativeElement.click()
  }

  async pickMedia( filePicker )
  {
    if( this.OnClick ) this.OnClick.emit( filePicker )
    this.iFile = await this.mediaSvc.pickImg( filePicker, this.maxSize )
    if( this.iFile && this.OnFile ) this.OnFile.emit( this.iFile )
  }

  toggleVideo( event )
  {
    // event.nativeElement.play()
    this.videoPlayer.nativeElement.play()
  }
}
