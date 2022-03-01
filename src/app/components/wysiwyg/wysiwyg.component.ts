import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';
import { iWYSIWYG } from './models/wysiwyg.model';
import 'quill-emoji/dist/quill-emoji.js';

@Component({
  selector: 'app-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss'],
})
export class WYSIWYGComponent implements OnInit {

  // https://www.freakyjolly.com/angular-rich-text-editor-using-ngx-quill-tutorial/
  // https://www.youtube.com/watch?v=f1qQOorMKGo
  // https://quilljs.com/docs/quickstart/

  @Input() placeholder: string = ''
  @Input() readOnly: boolean = false

  @Input() styles: {} = {height: '200px'}
  @Input() html: string
  @Output() OnFocus: EventEmitter<any> = new EventEmitter()
  @Output() OnChange: EventEmitter<iWYSIWYG> = new EventEmitter()
  @Output() OnBlur: EventEmitter<any> = new EventEmitter()
  @Output() OnImgClick: EventEmitter<any> = new EventEmitter()

  @ViewChild( "quill" ) quill: QuillEditorComponent

  blured = false
  focused = false
  
  modules: {}
  content: iWYSIWYG = {}
  contenido: string = ''

  constructor() {
    this.modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      'toolbar': { 'container': [
        /* [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'align': [] }], */
        ['bold'/* , 'italic', 'underline', 'strike' */],        // toggled buttons
        /* [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

        ['blockquote', 'code-block'],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], */

        ['link'/* , 'image', 'video' */],                         // link and image, video
        ['image'],

        /* ['emoji'] */

        /* ['clean'], */                                         // remove formatting button
      ],
        handlers: {
         'image': () => { if( this.OnImgClick ) this.OnImgClick.emit() }
        }
      }
    }
  }

  ngOnInit() {}

  ngAfterContentInit()
  {
    if( this.html ) this.contenido = this.html
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( 'html' in changes && this.quill ) this.contenido = changes.html.currentValue || ''
  }

  ionViewDidLeave()
  {
    this.clear()
  }

  clear()
  {
    this.html = ''
    this.contenido = ''
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // console.log('editor-change', event)
    if( event?.event == 'text-change' ) {
      this.content = {
        html: event?.editor?.root?.innerHTML || event?.html
      , text: event?.editor?.root?.innerText || event?.text
      }
      if( this.OnChange )
        this.OnChange.emit( this.content )
    }
  }

  focus($event) {
    if( this.OnFocus ) this.OnFocus.emit()

    this.focused = true
    this.blured = false
  }

  blur($event) {
    if( this.OnBlur ) this.OnBlur.emit()
    
    this.focused = false
    this.blured = true
  }

  created(quill) {
    // e.g. to capture prior user typing
    /* quill.keyboard.addBinding({
      key: 'b'
    }, (range, context) => {
      console.log('KEYBINDING B', range, context)
    })

    quill.keyboard.addBinding({
      key: 'B',
      shiftKey: true
    }, (range, context) => {
      console.log('KEYBINDING SHIFT + B', range, context)
    }) */
  }
}
