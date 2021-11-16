import { CookieService } from "ngx-cookie-service";
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
    static getLang( lang?: string, translateService?: TranslateConfigService ) : ILang {
      let langSelected;
      
      if( lang ) {
        ILangDEFAULTS.getLangs().forEach( iLang => {
          if( iLang.lang.trim() === lang.trim() )
            return langSelected = iLang;
        });
      }

      // Si langSelected existe, asignar ese valor || Sino ir a traer el default
      const language = langSelected || translateService.getCurrentLanguage() || ILangDEFAULTS.enUK;
      
      return language;
    }
    static getCurrentLang( translateService: TranslateConfigService ) : ILang {
      return this.getLang( translateService.getCurrentLanguage(), translateService );
    }

    // Para guardar el Lang en las Cookies
    static saveLangCOOKIE( cookSvc: CookieService, lang: ILang ) {
      cookSvc.set( ILangDEFAULTS.coookie, lang.lang );
    }

    // Para obtener el Lang en las Cookies
    static getLangCOOKIE( cookSvc: CookieService ) : ILang {
      let lang = cookSvc.get( ILangDEFAULTS.coookie );
      return !lang ? null : ILangDEFAULTS.getLang( lang );
    }
}