import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { Storage } from '@ionic/storage';
import { supportedLanguages } from '../../../utils/utils';
import { ILang, ILangDEFAULTS } from '../../models/langs.model';

@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  constructor(
    private translateService: TranslateService,
    // private storage: Storage
  ) {}

  async getLanguage(): Promise<string> {
    let language = this.getBrowserLang();

    // If has a saved Lang, take that selection
    
    let lang = <ILang> await ILangDEFAULTS.getLangSaved(  );
    if( lang != null ) language = lang.lang

    if (language)
    if (!supportedLanguages().includes(language))
      language = ILangDEFAULTS.enUK.lang;

    if (language) {
      this.translateService.setDefaultLang(language);
      return Promise.resolve(language);
  } else {
      // If language is undefined, provide a default language fallback
      const defaultLanguage = 'en'; // Change this to your desired default language
      this.translateService.setDefaultLang(defaultLanguage);
      return Promise.resolve(defaultLanguage);
  }
  // this.translateService.setDefaultLang(language);
  // return new Promise(resolve => { resolve( language )});
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
