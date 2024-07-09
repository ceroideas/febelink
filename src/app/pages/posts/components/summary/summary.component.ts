import { FileService } from './../../../../components/file-picker/services/file.service';
import { Component, OnInit, Input, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { DateFormatType } from './../../../../pipes/date-format.pipe';
import { IAdviseFull } from '../../advises/models/advises.model';
import { AdviseService } from '../../advises/services/advises.service';

@Component({
  selector: 'app-post-summary-component',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostSummaryComponent implements OnInit {

  @Input() id: number = 0
  //@ts-ignore
  @Input() iAdvise: IAdviseFull ;
  @Input() watchOnClick: boolean = true

  dateFormatType = DateFormatType

  constructor(
      private router: Router
    , public adviseSvc: AdviseService
    , public fileSvc: FileService
  ) {}

  ngOnInit() {}

  watch()
  {
    if( this.watchOnClick ) this.router.navigate([ `posts/oracle/${this.id}` ]);
  }
}
