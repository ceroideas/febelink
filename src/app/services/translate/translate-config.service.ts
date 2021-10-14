import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ILangDEFAULTS } from 'src/app/models/langs.model';
import { supportedLanguages } from 'src/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

    constructor(
        private translateService: TranslateService
      , private cookSvc: CookieService
    ) {}

    getDefaultLanguage(){
        let language = ILangDEFAULTS.getLangCOOKIE( this.cookSvc ).lang;
        // Si no tiene guardado Lang en Cookies, tomar del Browser
        if( !language )
            language = this.translateService.getBrowserLang();

        if (!supportedLanguages().includes(language)) {
            language = ILangDEFAULTS.enUK.lang;
        }

        this.translateService.setDefaultLang(language);
        return language;
    }

    getCurrentLanguage() {
        return this.translateService.currentLang;
    }

    setLanguage(language: string) {
        this.translateService.use(language);
        this.translateService.currentLang = language;
    }

    // Agregué este metodo para evitar que por defecto el currentLang lo setee a ingles
    setCurrentLang( language: string ) {
        // ToDo: eliminar este método porque ya lo solucioné
        // this.translateService.currentLang = language;
    }

    instant( key : string ) : string {
        return this.translateService.instant( key );
    }

    get( key : string, interpolateParams?: Object,
            next?: ( text: string ) => void,
            error?: ( error: any ) => void,
            complete?: () => void ) {
        this.translateService.get( key, interpolateParams ).subscribe(
            ( text: string ) => { if( next ) next( text ); },
            ( error: any ) => { if( error ) error( error ); },
            () => { if( complete ) complete(); });
    }

    addLangs( ...lang: string[] ) {
        this.translateService.addLangs( lang );
    }
}
