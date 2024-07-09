import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  constructor(private location: Location, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

 
  public goBack(): void {
    // this.location.back();
    this.modalCtrl.dismiss();
  }

}
