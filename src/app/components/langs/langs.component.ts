import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ILang } from 'src/app/models/langs.model';

@Component({
  selector: 'app-langs',
  templateUrl: './langs.component.html',
  styleUrls: ['./langs.component.scss'],
})
export class LangsComponent implements OnInit {

  langs: Array<ILang> = [
    { id: 0, lang: 'Español', flag: 'Flag_SP', shortCode: 'ES-SP' },
    { id: 1, lang: 'English', flag: 'Flag_UK', shortCode: 'EN-UK' },
  ]

  constructor( private popoverController: PopoverController ) { }

  ngOnInit() {}

  onLangSelected( lang :ILang ) {
    this.popoverController.dismiss( {
      item: lang
    })
  }
}
