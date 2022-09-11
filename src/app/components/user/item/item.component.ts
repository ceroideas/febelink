import {IUser} from 'src/app/models/user.model';
import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Router} from '@angular/router';
import {UserSessionSvc} from 'src/app/services/user-session.service';
import {IUserItem} from '../models/user-item.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class UserItemComponent implements OnInit {

  @Input() id: number;
  @Input() user: IUserItem;
  @Input() subtitle: string;
  @Input() txEnd: string;
  @Input() txSubEnd: string;
  @Input() clase: string;
  @Input() classImg: string;
  @Input() OnClickShowProfile: boolean = false;
  @Output() onUserClick: EventEmitter<IUserItem> = new EventEmitter();

  constructor(
    private router: Router
    , private sessionSvc: UserSessionSvc
  ) {
  }

  async ngOnInit() {
  }

  async userClick() {
    if (this.OnClickShowProfile) {
      this.goToProfile();
    }
    this.onUserClick.emit(this.user);
  }

  public async goToProfile() {
    if (await this.sessionSvc.checkLogged()) {
      this.router.navigate(['user/detail/' + this.id], {
        queryParams: {
          id_perfil: this.id
          , contacto: false
        },
      });
    }
  }

  filterUsers() {

  }
}
