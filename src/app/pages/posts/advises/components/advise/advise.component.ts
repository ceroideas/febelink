import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IOptsMenuButton } from 'src/app/components/opts-menu/models/opts-menu.model';
import { OptsMenuSvc } from 'src/app/components/opts-menu/services/opts-menu.service';
import { IUserItem } from 'src/app/components/user/models/user-item.model';
import { AlertSvc } from 'src/app/services/alert.service';

@Component({
  selector: 'app-advise-component',
  templateUrl: './advise.component.html',
  styleUrls: ['./advise.component.scss'],
})
export class AdviseComponent implements OnInit {
  
  @Input() user: IUserItem;
  @Input() subtitle: string;
  @Input() txEnd: string;
  @Input() txSubEnd: string;
  @Input() OnClickShowProfile: boolean = false;
  @Output() onUserClick: EventEmitter<IUserItem> = new EventEmitter()

  constructor(
      private alertSvc: AlertSvc
    , private optsMenuSvc: OptsMenuSvc
  ) {}

  async ngOnInit() {

  }

  async options( event )
  {
    let opts = [
      {
        text: 'pages.post.advises.opts.0.text'
        , click: ( iOptsMenuButton: IOptsMenuButton ) => {
          
        }
      }
    ]
    await this.optsMenuSvc.show( event, opts );
  }
}
