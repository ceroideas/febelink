import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating-summary',
  templateUrl: './rating-summary.component.html',
})
export class RatingSummaryComponent implements OnInit {
  
  @Input() rating: number = 0;

  constructor() { }

  ngOnInit() {}

}
