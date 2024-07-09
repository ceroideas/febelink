import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  EditorChangeContent,
  EditorChangeSelection,
  QuillEditorComponent,
} from 'ngx-quill';
import { iWYSIWYG } from './models/wysiwyg.model';
// import 'quill-emoji/dist/quill-emoji.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss'],
})
export class WYSIWYGComponent implements OnInit, AfterViewInit {

  @Input() placeholder: string = '';
  @Input() readOnly: boolean = false;

  @Input() styles: {} = { height: '200px' };
  @Input() html: string = "";
  @Output() OnFocus: EventEmitter<any> = new EventEmitter();
  @Output() OnChange: EventEmitter<iWYSIWYG> = new EventEmitter();
  @Output() OnBlur: EventEmitter<any> = new EventEmitter();
  @Output() OnImgClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('quill')
  quill!: QuillEditorComponent;

  blured = false;
  focused = false;

  modules: {};
  content: iWYSIWYG = {};
  contenido: string = '';

  apiMetaTagUrl: string = `${environment.baseWebUrl}api/auth/meta-tags`;
  linksArray: string[] = [];

  constructor(private http: HttpClient) {
    this.modules = {
     
      toolbar: false,
    };
  }

  
  public apiCallbackFn = (route: any) => {
    return this.http.get(route).pipe(
      catchError((error: any) => {
        // You can handle the error here or rethrow it if necessary
        return throwError(error); // Rethrow the error if needed
      })
    );
  };

  ngOnInit() {}

  ngAfterContentInit() {
    if (this.html) {
      this.contenido = this.html;
    }
  }

  ngAfterViewInit() {
    const html = this.contenido;
    const div = document.createElement('div');
    div.innerHTML = html.replace(/<br>/g, ' ').replace(/<p>|<\/p>/g, ' ');
    const adaptedText = div.textContent || div.innerText || '';

    this.loadLinks(adaptedText);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('html' in changes && this.quill) {
      this.contenido = changes['html'].currentValue || '';
    }
  }

  ionViewDidLeave() {
    this.clear();
  }

  clear() {
    this.html = '';
    this.contenido = '';
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // console.log('editor-change', event)
    if (event?.event == 'text-change') {
      this.content = {
          html: event?.editor?.root?.innerHTML ?? event?.html ?? undefined,
          text: event?.editor?.root?.innerText ?? event?.text ?? undefined,
      };

      this.loadLinks(String(this.content.text));

      if (this.OnChange) {
        this.OnChange.emit(this.content);
      }
    }
  }

  focus($event: any) {
    if (this.OnFocus) {
      this.OnFocus.emit();
    }

    this.focused = true;
    this.blured = false;
  }

  blur($event: any) {
    if (this.OnBlur) {
      this.OnBlur.emit();
    }

    this.focused = false;
    this.blured = true;
  }

  created(quill: any) {
  }

  loadLinks(text: string) {
    this.linksArray = text.split(/[\s,]+|\.\s/).filter((splitedWord: any) => {
      if (splitedWord){
        if (splitedWord.match(/^https?:\/\/.*\.(com|es|net|org|be)/i)) {
          return splitedWord.match(/^https?:\/\/.*\.(com|es|net|org|be)/i)[0];
        }
      }
     
    });
  }
}
