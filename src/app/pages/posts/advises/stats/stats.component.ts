import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IStats } from '../models/stats.model';
import { PostStatsSvc } from '../services/stats.service';
import { DateFormatType } from '../../../../pipes/date-format.pipe';

@Component({
  selector: 'app-post-stats-component',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class PostStatsComponent implements OnInit
{
  @Input() id: any
  @Input() stats: IStats | null = null
  
  dateFormatType = DateFormatType
  isLoading: boolean | null = null

  constructor(
      private router: Router
    , private postStatsSvc: PostStatsSvc
  ) {}

  ngOnInit() {}

  ngOnChanges( changes: SimpleChanges ): void
  {
    if ( 'id' in changes) {
      this.id = changes['id'].currentValue
      if( this.id ) this.get()
    }
  }

  async get()
  {
    this.isLoading = true
    const { response } = await this.postStatsSvc.getQs( Number(this.id) )
    this.stats = response
    this.isLoading = false
  }

  seePosts()
  {
    this.router.navigate([ 'posts/oracles' ], { queryParams: { uid: this.id }})
  }
}
