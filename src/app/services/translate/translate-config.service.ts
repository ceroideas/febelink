import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { supportedLanguages } from 'src/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(private translateService: TranslateService) { }

    getDefaultLanguage(){
        let language = this.translateService.getBrowserLang();

        if (!supportedLanguages().includes(language)) {
            language = 'en';
        }

        this.translateService.setDefaultLang(language);
        return language;
    }

    getCurrentLanguage() {
        return this.translateService.currentLang;
    }

    setLanguage(language: string) {
        this.translateService.use(language);
    }

    // Agregué este metodo para evitar que por defecto el currentLang lo setee a ingles
    setCurrentLang( language: string ) {
        this.translateService.currentLang = language;
    }
}
