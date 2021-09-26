import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: [ './timer.component.scss', '../../landing/pages/index1/index1.component.scss' ],
})
export class TimerComponent implements OnInit {

  @Input() mess: string = "00";
  @Input() dias: string = "00";
  @Input() hors: string = "00";
  @Input() mins: string = "00";
  @Input() segs: string = "00";

  constructor() { }

  ngOnInit() {}

}
