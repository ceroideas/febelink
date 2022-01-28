import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit {
  
  @Input() user: IUser;
  @Output() onUserClick: EventEmitter<IUser> = new EventEmitter()

  constructor() {}

  async ngOnInit() {}

   async userClick() {
    this.onUserClick.emit( this.user );
  }
}
