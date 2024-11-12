import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Rating } from '../../interfaces/rating';

@Component({
  selector: 'app-rating-card',
  templateUrl: './rating-card.component.html'
})
export class RatingCardComponent implements OnInit {

  @Input() rating: Rating | undefined;
  @Input() canDelete: boolean = false;

  @Output() deleteRating = new EventEmitter<void>();

  urlWsrv: string = environment.baseWebUrlWsrv;

  constructor() { }

  ngOnInit() {}

}
