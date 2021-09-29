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
}