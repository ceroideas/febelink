import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html'
})
export class RatingModalComponent implements OnInit {

  @Input() mode: 'client' | 'professional' = 'client';
  @Input() hideSkipButton: boolean = false;

  public rating: number = 5;
  public comment: string = '';

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  setRating(rating: number) {
    if ( rating === 1 && this.rating === 1 ) {
      this.rating = 0;
    } else {
      this.rating = rating;
    }
  }

  rate() {
    this.modalCtrl.dismiss({
      rating: this.rating,
      comment: this.comment
    }, 'confirm');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'confirm');
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
