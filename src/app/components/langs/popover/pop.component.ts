import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';

@Component({
  selector: 'app-lang-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
})
export class LangPopComponent implements OnInit {

  langs: Array<ILang> = ILangDEFAULTS.getLangs();

  constructor( private popoverController: PopoverController ) { }

  ngOnInit() {}

  onLangSelected( lang :ILang ) {
    this.popoverController.dismiss( { lang })
  }
}
