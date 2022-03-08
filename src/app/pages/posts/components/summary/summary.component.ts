import { Component, OnInit, Input, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { DateFormatType } from 'src/app/pipes/date-format.pipe';
import { IAdviseFull } from '../../advises/models/advises.model';
import { AdviseService } from '../../advises/services/advises.service';

@Component({
  selector: 'app-post-summary-component',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostSummaryComponent implements OnInit {

  @Input() id: number
  @Input() iAdvise: IAdviseFull

  dateFormatType = DateFormatType

  constructor(
      private router: Router
    , public adviseSvc: AdviseService
  ) {}

  ngOnInit() {}

  watch()
  {
    this.router.navigate([ `posts/oracle/${this.id}` ]);
  }
}
