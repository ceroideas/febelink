import { Component, Input, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: [ './timer.component.scss', '../../landing/pages/index1/index1.component.scss' ],
})
export class TimerComponent implements OnInit {

  @Input() months: string = "00";
  @Input() days: string = "00";
  @Input() hours: string = "00";
  @Input() mins: string = "00";
  @Input() secs: string = "00";

  constructor( private translateService: TranslateConfigService ) { }

  ngOnInit() {}

}
