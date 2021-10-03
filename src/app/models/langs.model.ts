import { CookieService } from "ngx-cookie-service";

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
    static coookie: string = "lang";

    static getLangs() : Array<ILang> {
      let arr: Array<ILang> = [
        ILangDEFAULTS.spSP,
        ILangDEFAULTS.enUK
      ];
      return arr;
    }
    static getLang( lang?: string, cookSvc?: CookieService ) : ILang {
      let langSelected;
      
      if( lang ) {
        ILangDEFAULTS.getLangs().forEach( iLang => {
          if( iLang.lang.trim() === lang.trim() )
            return langSelected = iLang;
        });
      }

      // Si langSelected existe, asignar ese valor || Sino ir a traer el default
      return langSelected ? langSelected : this.getLangDEFAULT( cookSvc );
    }

    // Para traer el idioma por default
    static getLangDEFAULT( cookSvc?: CookieService ): ILang {
      // Si han pasado parametro de Cookie, entonces intentar buscar alli
      let lang: ILang = !cookSvc ? null : ILangDEFAULTS.getLangCOOKIE( cookSvc );

      // Si no hay cookies guardadas, entonces
      // utilizo por defecto el Español  
      return lang ? lang : ILangDEFAULTS.spSP;
    }

    // Para guardar el Lang en las Cookies
    static saveLangCOOKIE( cookSvc: CookieService, lang: ILang ) {
      cookSvc.set( ILangDEFAULTS.coookie, lang.lang );
    }

    // Para obtener el Lang en las Cookies
    static getLangCOOKIE( cookSvc: CookieService ) : ILang {
      let lang = cookSvc.get( ILangDEFAULTS.coookie );
      console.log( 'Lang in cookie: ', lang );
      return !lang ? null : ILangDEFAULTS.getLang( lang );
    }
}