import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { getLangParam, ILang, ILangDEFAULTS } from 'src/app/models/langs.model';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { LangPopComponent } from '../popover/pop.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-lang-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss'],
})
export class LangBtnComponent implements OnInit {
  
  @Input() langSelected: ILang;
  @Input() langIdSelected: number
  @Input() changeAppLang: boolean = true;
  @Input() disabled: boolean = false;
  @Output() onLangSelected: EventEmitter<ILang> = new EventEmitter()

  constructor(
    public popoverController: PopoverController,
    private storage: Storage,
    private translateService: TranslateConfigService ) { }

  async ngOnInit() {
    this.langSelected = await this.getLang();
  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( 'langIdSelected' in changes) {
      this.langIdSelected = changes.langIdSelected.currentValue
      this.langSelected = getLangParam( this.langIdSelected ) || this.langSelected
    }
  }

  async getLang(): Promise<ILang>
  {
    return this.langSelected ? this.langSelected :
      <ILang> await ILangDEFAULTS.getCurrentLang( this.translateService );
  }


  /**
   * Select Language
   */
   async selectLang( ev: any ) {
    if( this.disabled ) return
    
    const popover = await this.popoverController.create({
      component: LangPopComponent,
      event: ev,
      translucent: true,
      mode: 'md',
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if( !data )
      return;
    
    // Una vez que obtengo el Lang lo asigno
    this.langSelected = data.lang as ILang;
    if( this.changeAppLang ) {
      this.translateService.setLanguage( this.langSelected.lang );

      // Now I save the selection 
      ILangDEFAULTS.saveLang( this.storage, this.langSelected );
    }

    // En caso de necesitar en algun momento un callback para saber que lenguaje ha escogido
    this.onLangSelected.emit( this.langSelected );
  }

  async id(): Promise<number>
  {
    return (await this.getLang() )?.id || 1
  }
}
