import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AcercaDePage } from 'src/app/pages/acerca-de/acerca-de.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor( private modalCtrl: ModalController ) { }

  ngOnInit() {}

  async open() {

    const infoModal = await this.modalCtrl.create({
      component: AcercaDePage
    });

    await infoModal.present();

  }

}
