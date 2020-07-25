import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss'],
})
export class CookiesComponent implements OnInit {

  constructor( private modalCtrl: ModalController ) { }

  ngOnInit() {}

  public closeModal():void {
    this.modalCtrl.dismiss();
  }

}
