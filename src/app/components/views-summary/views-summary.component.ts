import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-views-summary',
  templateUrl: './views-summary.component.html',
})
export class ViewsSummaryComponent implements OnInit {

  @Input() views: number = 0;

  constructor() { }

  ngOnInit() {}

}
