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

    static getLangs() : Array<ILang> {
      let arr: Array<ILang> = [
        ILangDEFAULTS.spSP,
        ILangDEFAULTS.enUK
      ];
      return arr;
    }
    static getLang( lang?: string ) : ILang {
      let langSelected;
      
      if( lang ) {
        ILangDEFAULTS.getLangs().forEach( iLang => {
          if( iLang.lang.trim() === lang.trim() )
            return langSelected = iLang;
        });
      }

      return langSelected ? langSelected : this.getLangDEFAULT();
    }

    // Para traer el idioma por default
    // Por ahora español, mas adelante
    // el que tenga el usuario guardado en las DDBB
    static getLangDEFAULT(): ILang {
      return ILangDEFAULTS.spSP;
    }
}