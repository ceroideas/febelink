import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FilePickType, FileElementType } from './models/file.model';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent implements OnInit {

  @Input() src: string | ArrayBuffer = ''
  @Input() fallback: string = 'assets/imgs/photo.png'
  @Input() height: string = '100%'
  @Input() width: string = '100%'
  @Input() maxSize: number = 307200
  @Input() styles: string = ''
  @Input() classes: string = ''

  @Input() pickType: FilePickType = FilePickType.IMAGE
    pickTypes = FilePickType
  @Input() elType: FileElementType = FileElementType.ION_IMG
    elTypes = FileElementType

  @Output() OnClick: EventEmitter<any> = new EventEmitter()
  @Output() OnFile: EventEmitter<string | ArrayBuffer> = new EventEmitter()
  
  isNative: boolean = false


  constructor(
      public mediaSvc: FileService
    , private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => this.isNative = this.platform.is( 'cordova' ))
  }

  async pickMedia( filePicker ) {
    if( this.OnClick ) this.OnClick.emit( filePicker )
    this.src = await this.mediaSvc.pickImg( filePicker )
    if( this.src && this.OnFile ) this.OnFile.emit( this.src )
  }
}
