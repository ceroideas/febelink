import { Component, Input, OnInit } from '@angular/core';
import { DateFormatType } from 'src/app/pipes/date-format';
import { IAdvise } from '../models/advises.model';

@Component({
  selector: 'app-post-advise',
  templateUrl: './advise.page.html',
  styleUrls: ['./advise.page.scss'],
})
export class AdvisePage implements OnInit {

  @Input() id: number
  @Input() iAdvise: IAdvise

  dateFormatType = DateFormatType

  constructor() { }

  ngOnInit() {
  }

}
