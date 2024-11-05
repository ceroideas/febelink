import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-rating-card',
  templateUrl: './rating-card.component.html'
})
export class RatingCardComponent implements OnInit {

  @Input() rating: {
    rating: number,
    comment: string,
    date: string,
    who: string,
    avatarImageURL: string,
  } | undefined;

  urlWsrv: string = environment.baseWebUrlWsrv;

  constructor() { }

  ngOnInit() {}

}
