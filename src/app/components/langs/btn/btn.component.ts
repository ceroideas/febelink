import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LangPopComponent } from '../popover/pop.component';
import { TranslateConfigService } from '../../../services/translate/translate-config.service';
import { ILang, ILangDEFAULTS, getLangParam } from '../../../models/langs.model';

@Component({
  selector: 'app-lang-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss'],
})
export class LangBtnComponent implements OnInit {
  
  //@ts-ignore
  @Input() langSelected: ILang | any;
  @Input() langIdSelected: number = 0
  @Input() changeAppLang: boolean = true;
  @Input() disabled: boolean = false;
  @Input() initNull: boolean = false;
  @Input() short: boolean = true;
  @Output() onLangSelected: EventEmitter<ILang> = new EventEmitter()


  load: boolean = true;
  constructor(
    public popoverController: PopoverController,
    private translateService: TranslateConfigService ) { }

  async ngOnInit() {
    //@ts-ignore
    this.langSelected = this.initNull ? null : await this.getLang();
    this.load = false

  }

  ngOnChanges( changes: SimpleChanges ): void {
    if ( 'langIdSelected' in changes) {
      this.langIdSelected = changes['langIdSelected'].currentValue
      this.langSelected = getLangParam( this.langIdSelected ) || this.langSelected
    }
  }

  async getLang(): Promise<ILang>
  {
    return this.langSelected ? this.langSelected :
      <ILang> await ILangDEFAULTS.getCurrentLang( this.translateService );
  }

  async getLangSelected(): Promise<ILang>
  {
    return this.langSelected;
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
      ILangDEFAULTS.saveLang( this.langSelected );
    }

    // En caso de necesitar en algun momento un callback para saber que lenguaje ha escogido
    this.onLangSelected.emit( this.langSelected );
  }

  async id(ifNull: number | null = 1): Promise<number> {
    const lang = await this.getLang();
    return Number(lang?.id !== undefined ? lang.id : ifNull);
}

  async idSelected( ifNull: number | null = 1 ): Promise<number>
  {
    const lang = await this.getLang();
    return   Number(lang?.id !== undefined ? lang.id : ifNull);
  }
}
