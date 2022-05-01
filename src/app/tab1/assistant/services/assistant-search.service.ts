import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IKeys, IKeywords, IMatch } from '../models/assistant.model';

@Injectable({
  providedIn: 'root',
})
export class AssistantSearchSvc {
  iKeyWords: IKeywords = {
    selectorEnabled: false,
  };
  isLoading: boolean;
  @Output() OnGotKeys: EventEmitter<number> = new EventEmitter();

  private callSearch: Subscription;
  private callSectors: Subscription;

  constructor(private api: ApiService) {}

  search(text): Promise<IKeywords> {
    return new Promise(async (resolve) => {
      this.iKeyWords.searchText = text;
      this.iKeyWords.keys = [];
      this.iKeyWords.selectorEnabled = true;

      if (text?.length > 2 && this.iKeyWords.selectorEnabled) {
        this.isLoading = true;

        this.callSearch?.unsubscribe(); // To avoid memory leaks
        this.callSearch = (await this.api.searchByKeys(text)).subscribe(
          (keywords) => {
            console.log({ keywords });
            if (keywords.length !== 0) {
              this.iKeyWords.keys = [];
              for (let key of keywords) {
                let item = {
                  name: this.highlight(key.keyword),
                  value: key.keyword,
                  key,
                };
                this.iKeyWords.keys.push(item);
              }
              this.isLoading = false;
              resolve(this.iKeyWords);
            } else {
              setTimeout(() => {
                this.iKeyWords.selectorEnabled = false;
                this.isLoading = false;
                resolve(this.iKeyWords);
              }, 500);
            }
            console.log({
              keys: this.iKeyWords.keys,
              iKeyWords: this.iKeyWords,
            });
          }
        );
      }
    });
  }

  highlight(query) {
    if (!this.iKeyWords.searchText) return query;

    return query
      .toString()
      .replace(new RegExp(this.iKeyWords.searchText, 'gi'), (match) => {
        return '<strong>' + match + '</strong>';
      });
  }

  //NEW SEARCH COMPONENT
  addFocus() {
    this.selectorEnabled(true);
  }

  detectKeyPressed(event, searchText: string): Promise<any> {
    return new Promise((resolve) => {
      if (event.key === 'Enter' && this.searchText()?.length > 2) {
        this.showCard(true);
        setTimeout(() => {
          // this.keys().length = 0;
          this.search(searchText);
          resolve(true);
        }, 500);
      }
    });
  }

  removeFocus() {
    setTimeout(() => {
      this.keyText(this.searchText());
      this.selectorEnabled(false);
      this.keys([]);
    }, 500);
  }

  clearBtn() {
    this.keys([]);
  }

  async getSectorsByKeys(key: IKeys) {
    this.isLoading = true;
    this.keys([]);
    this.searchText(key.value);

    this.callSectors?.unsubscribe(); // To avoid memory leaks
    await (
      await this.api.getSectorsByKeys(key.value)
    ).subscribe((keywords) => {
      console.log('keywords', keywords);

      this.set(key.value, keywords?.main, true);

      // check if found a match
      if (keywords.main) this.OnGotKeys.emit(keywords.main);

      this.showCard(true);
      this.removeFocus();

      this.isLoading = false;
    });
  }

  // Getters && Setters
  set(searchText: string, main: IMatch, enabled: boolean) {
    this.searchText(searchText);
    this.keyText(searchText);
    this.main(main);
    this.selectorEnabled(enabled);
  }

  get(): IKeywords {
    return this.iKeyWords;
  }

  searchText(text?: string): string {
    if (text != undefined) this.iKeyWords.searchText = text;
    return this.iKeyWords?.searchText;
  }
  keyText(text?: string): string {
    if (text) this.iKeyWords.searchText = text;
    return this.iKeyWords?.keyText;
  }
  keys(keys?: IKeys[]): IKeys[] {
    if (keys != undefined) this.iKeyWords.keys = keys;
    return this.iKeyWords?.keys;
  }
  hasKeys(): boolean {
    return (this.keys() || []).length > 0;
  }
  selectorEnabled(enabled?: boolean): boolean {
    if (enabled != undefined) this.iKeyWords.selectorEnabled = enabled;
    return this.iKeyWords?.selectorEnabled;
  }
  candidates(candidates?: IKeys[]): any[] {
    if (candidates != undefined) this.iKeyWords.candidates = candidates;
    return this.iKeyWords?.candidates;
  }
  main(main?: IMatch): IMatch {
    if (main != undefined) this.iKeyWords.main = main;
    return this.iKeyWords?.main;
  }
  showCard(show?: boolean): boolean {
    if (show != undefined) this.iKeyWords.selectorEnabled = show;
    return this.iKeyWords?.showCard;
  }

  clear() {
    this.iKeyWords = {
      selectorEnabled: false,
    };
    this.isLoading = false;
    // To avoid Memory Leaks
    this.callSearch?.unsubscribe();
    this.callSectors?.unsubscribe();
  }
}
