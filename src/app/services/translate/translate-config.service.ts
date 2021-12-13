import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { supportedLanguages } from 'src/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  constructor(
    private translateService: TranslateService,
    private storage: Storage
  ) {}

  async getLanguage(): Promise<string> {
    let language = this.getBrowserLang();

    // If has a saved Lang, take that selection
    let lang = <ILang> await ILangDEFAULTS.getLangSaved( this.storage );
    if( lang != null ) language = lang.lang;

    if (!supportedLanguages().includes(language))
      language = ILangDEFAULTS.enUK.lang;

    this.translateService.setDefaultLang(language);
    return new Promise(resolve => { resolve( language )});
  }

  getBrowserLang() {
    return this.translateService.getBrowserLang();
  }
  
  setLanguage(language: string) {
    this.translateService.use(language);
    this.translateService.currentLang = language;
  }

  instant(key: string, params: Object = {}): string {
    return this.translateService.instant( key, params );
  }

  get(
    key: string,
    interpolateParams?: Object,
    next?: (text: string) => void,
    error?: (error: any) => void,
    complete?: () => void
  ) {
    this.translateService.get(key, interpolateParams).subscribe(
      (text: string) => {
        if (next) next(text);
      },
      (error: any) => {
        if (error) error(error);
      },
      () => {
        if (complete) complete();
      }
    );
  }

  addLangs(...lang: string[]) {
    this.translateService.addLangs(lang);
  }
}
