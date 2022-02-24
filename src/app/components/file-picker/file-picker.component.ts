import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  file: any
  @Input() fallback: string = 'assets/icon/svg/nopic.svg'
  @Input() height: string = '100%'
  @Input() width: string = '100%'
  @Input() maxSize: FileMaxSize = FileMaxSize.MAX_ALLOWED_PACKET
  @Input() styles: string = ''
  @Input() classes: string = ''

  @Input() pickType: FilePickType = FilePickType.IMAGE
    pickTypes = FilePickType
  @Input() elType: FileElementType = FileElementType.ION_IMG
    elTypes = FileElementType

  @Output() OnClick: EventEmitter<any> = new EventEmitter()
  @Output() OnFile: EventEmitter<IFile> = new EventEmitter()
  
  isNative: boolean = false

  @ViewChild( "filePicker" ) filePicker: ElementRef

  constructor(
      public mediaSvc: FileService
    , private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => this.isNative = this.platform.is( 'cordova' ))
  }

  clicks()
  {
    this.filePicker.nativeElement.click()
  }

  async pickMedia( filePicker ) {
    if( this.OnClick ) this.OnClick.emit( filePicker )
    const { src, file } = await this.mediaSvc.pickImg( filePicker, this.maxSize )
    this.src = src
    this.file = file
    if( this.src && this.OnFile ) this.OnFile.emit({ src, file })
  }
}
