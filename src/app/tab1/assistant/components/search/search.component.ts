import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IKeys, IKeywords } from '../../models/assistant.model';
import { AssistantSearchSvc } from '../../services/assistant-search.service';

@Component({
  selector: 'app-assistant-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class AssistantSearchComponent implements OnInit {
  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  @Input() clase: string = '';

  @Output() OnGotKeys: EventEmitter<number> = new EventEmitter();
  @Output() OnEnter: EventEmitter<any> = new EventEmitter();

  constructor(public assistantSearchSvc: AssistantSearchSvc) {
    this.assistantSearchSvc.OnGotKeys.unsubscribe(); // In case there is a previous subscrioption
    this.assistantSearchSvc.OnGotKeys = this.OnGotKeys;
  }

  ngOnInit() {}

  get(): IKeywords {
    return this.assistantSearchSvc.get();
  }

  text(text?: string): string {
    if (text != undefined) this.searchText = text;
    // this.assistantSearchSvc.searchText( text )
    return this.searchText || '';
  }

  getSectorsByKeys(keys?: IKeys) {
    this.assistantSearchSvc.getSectorsByKeys(
      keys || {
        name: this.assistantSearchSvc.highlight(this.searchText),
        value: this.searchText,
      }
    );
  }

  async OnEnterPress($event) {
    await this.assistantSearchSvc.detectKeyPressed($event, this.searchText);
    // Will only emit when enter promise resolved
    this.OnEnter.emit();
  }

  clear() {
    this.searchText = '';
    this.assistantSearchSvc.clear();
  }
}
