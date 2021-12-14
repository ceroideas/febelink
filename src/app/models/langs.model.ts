import { TranslateConfigService } from "../services/translate/translate-config.service";
import { Storage } from '@ionic/storage';

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

/**
 * Default Languages
 */
 export abstract class ILangDEFAULTS {
    static spSP: ILang = { id: 0, language: 'Español', lang: 'es', country: 'es', flag: 'Flag_SP', shortCode: 'ES-ES' };
    static enUK: ILang = { id: 1, language: 'English', lang: 'en', country: 'uk', flag: 'Flag_UK', shortCode: 'EN-UK' };
    static key: string = "lang";

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
    static saveLang( storage: Storage, lang: ILang ) {
      storage.set( ILangDEFAULTS.key, lang ).then(() => {})
        .catch(error => console.log( 'There was an error on saving Lang:', error ));
    }
    
    // To get the Lang saved
    static async getLangSaved( storage: Storage ): Promise<ILang> {
      let lang: ILang = null;
      await storage.ready();
      lang = await storage.get( ILangDEFAULTS.key );
      
      return new Promise( resolve => { resolve( lang )});
    }
}