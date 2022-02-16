import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
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
  @Output() OnFocus: EventEmitter<any> = new EventEmitter()
  @Output() OnChange: EventEmitter<iWYSIWYG> = new EventEmitter()
  @Output() OnBlur: EventEmitter<any> = new EventEmitter()


  blured = false
  focused = false
  
  modules: {}
  content: iWYSIWYG

  constructor() {
    this.modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      'toolbar': [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

        ['blockquote', 'code-block'],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        ['clean'],                                         // remove formatting button

        // ['link', 'image', 'video'],                         // link and image, video
        ['emoji']

      ]
    }
  }

  ngOnInit() {}

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
