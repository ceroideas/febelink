import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion-ctrl',
  templateUrl: './sesion-ctrl.page.html',
  styleUrls: ['./sesion-ctrl.page.scss'],
})
export class SesionCtrlPage implements OnInit {

  constructor( private modalCtrl: ModalController,
               private router: Router ) { }

  ngOnInit() {

  }

  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  irLogin() {
    this.modalCtrl.dismiss();
    this.router.navigate(['login']);
  }

}
