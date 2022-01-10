import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface Button {
  text: string,
  dismiss: boolean
}

@Component({
  selector: 'app-inform',
  templateUrl: './inform.component.html',
  styleUrls: ['./inform.component.scss'],
})

export class InformComponent implements OnInit {

  @Input() title: string;

  @Input() image: string = 'assets/landing/logo-dark.png';
  @Input() showImage: boolean = true;
  
  @Input() pompadour: string;
  @Input() showPompadour: boolean = true;
  
  @Input() subtitle: string;
  @Input() showSubtitle: boolean = true;

  @Input() description: string;
  
  // IF null => wont show || if true => '' || if false => 
  @Input() showCheckmark: boolean = null;
  checkmark: string;

  @Input() buttons: Button[];
  @Output() OnClick: EventEmitter<Button> = new EventEmitter()

  constructor(
      private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.checkmark = this.showCheckmark == false ? 'close-circle-outline' : 'checkmark-circle-outline';
  }

  onDismiss( ) {
    this.modalCtrl.dismiss({ });
  }

  onButtonClick( button: Button ) {
    if( button?.dismiss ) {
      this.onDismiss();
      return;
    }

    // Callback
    this.OnClick.emit( button );
  }
}
