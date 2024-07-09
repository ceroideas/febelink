import { TranslateConfigService } from "../services/translate/translate-config.service";

/**
 * Description [Interface to define User Language Selection.]
 *
 * @author abdias
 * @version 0.0.1
 *
 * @interface
 */
export interface ILang {
  id: number;
  language: string;
  lang: string;
  country: string,
  flag: string;
  shortCode: string;
}

export function getLangParam( id: number | string ) {
  switch( +id ) {
    case 2:
      return ILangDEFAULTS.enUK
    case 1:
    default:
      return ILangDEFAULTS.spSP
  }
}

/**
 * Default Languages
 */
 export abstract class ILangDEFAULTS {
    static spSP: ILang = { id: 1, language: 'Español', lang: 'es', country: 'es', flag: 'Flag_SP', shortCode: 'ES-ES' };
    static enUK: ILang = { id: 2, language: 'English', lang: 'en', country: 'uk', flag: 'Flag_UK', shortCode: 'EN-UK' };
    static key: string = "lang";
   static defaultValue: ILang;

    static getLangs() : Array<ILang> {
      let arr: Array<ILang> = [
        ILangDEFAULTS.spSP,
        ILangDEFAULTS.enUK
      ];
      return arr;
    }
    static getLang( lang?: string ): ILang {
      for( let i = 0; lang && i < ILangDEFAULTS.getLangs().length; i++ )
        if( ILangDEFAULTS.getLangs()[ i ].lang.trim() == lang.trim() )
          return ILangDEFAULTS.getLangs()[ i ];

      // No lang selected, bring default
      return ILangDEFAULTS.enUK;
    }
    static async getCurrentLang( translateService: TranslateConfigService ): Promise<ILang> {
      let language = await translateService.getLanguage();
      return new Promise( resolve => { resolve( this.getLang( language ))});
    }

    // To save Lang selected
    static saveLang( lang: ILang ) {
      // storage.set( ILangDEFAULTS.key, lang ).then(() => {})
      //   .catch(error => console.log( 'There was an error on saving Lang:', error ));
      try {
        localStorage.setItem(ILangDEFAULTS.key, JSON.stringify(lang));
      } catch (error) {
        console.error('Error while saving language data to localStorage:', error);
        // Handle error here
      }
    }
    
    // To get the Lang saved
    static async getLangSaved(): Promise<ILang> {
      // let lang: ILang = ILangDEFAULTS.defaultValue; // Provide a default value here
      // lang = await storage.get(ILangDEFAULTS.key) ?? lang; // Use nullish coalescing operator to keep the default value if storage.get returns null
  
      // return lang;

      let lang: ILang = ILangDEFAULTS.defaultValue; // Provide a default value here
      try {
        const langData = localStorage.getItem(ILangDEFAULTS.key);
        if (langData) {
          lang = JSON.parse(langData);
        }
      } catch (error) {
        console.error('Error while parsing language data from localStorage:', error);
        // Handle error here
      }
      
      return lang;
  }
}