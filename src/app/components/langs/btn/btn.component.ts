import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { LangPopComponent } from '../popover/pop.component';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-lang-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss'],
})
export class LangBtnComponent implements OnInit {
  
  @Input() langSelected: ILang;
  @Output() onLangSelected: EventEmitter<ILang> = new EventEmitter()

  constructor(
    public popoverController: PopoverController,
    private cookSvc: CookieService,
    private translateService: TranslateConfigService ) { }

  ngOnInit() {
    this.langSelected = this.langSelected ? this.langSelected :
        ILangDEFAULTS.getCurrentLang( this.translateService );
  }


  /**
   * Select Language
   */
   async selectLang( ev: any ) {
    const popover = await this.popoverController.create({
      component: LangPopComponent,
      event: ev,
      translucent: true,
      mode: 'md',
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    // Una vez que obtengo el Lang lo asigno
    this.langSelected = data.lang as ILang;
    this.translateService.setLanguage( this.langSelected.lang );

    // Ahora lo guardo en las Cookies
    ILangDEFAULTS.saveLangCOOKIE( this.cookSvc, this.langSelected );

    // En caso de necesitar en algun momento un callback para saber que lenguaje ha escogido
    this.onLangSelected.emit( this.langSelected );
  }
}
