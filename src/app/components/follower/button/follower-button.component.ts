import {IUser} from '../../../models/user.model';
import {Component, Input, OnInit} from '@angular/core';
import {FollowerService} from '../services/follower.service';
import {IFollower} from '../models/follower.model';
import {UserSessionSvc} from '../../../services/user-session.service';
import {ToastSvc} from '../../../services/toast.service';

@Component({
  selector: 'app-follower-button',
  templateUrl: './follower-button.component.html',
  styleUrls: ['./follower-button.component.scss'],
})
export class FollowerButtonComponent implements OnInit {

  @Input() user: IUser | undefined
  @Input() clase: string = "";
  @Input() follower: IFollower | undefined
  @Input() transparent: boolean = false;

  isLoading: boolean = false;
  isLogged: boolean = false;

  constructor(
    private userSessionSvc: UserSessionSvc,
    private followerSvc: FollowerService,
    private toastSvc: ToastSvc,
  ) {
  }

  ngOnInit() {
    this.get();
  }

  async get() {
    if (this.isLogged == null) {
      this.isLogged = await this.userSessionSvc.isLogged();
    }
    if (!this.isLogged) {
      return;
    }

    this.isLoading = true;

    const {response, error} = await this.followerSvc.get(
      //@ts-ignore
      await this.userSessionSvc.id(),
      Number(this.user?.id)
    );

    if (response) {
      this.follower = response;
    } else {
      this.follower = {
        uid_follower: Number(await this.userSessionSvc.id()),
        uid_followed: Number(this.user?.id),

        created_at: "",
        canceled_at: ""
      } as IFollower;
    }

    this.isLoading = false;
  }

  async toggleFollow() {
    // Wait until previous process to finish
    if (this.isLoading) {
      return;
    }

    // Can't follow themselves
    if (await this.isSame()) {
      return;
    }

    this.isLoading = true;
    if (this.follower !== undefined) {
       const {response, error} = await this.followerSvc.toggle(this.follower);
       if (error) {
        this.toastSvc.show(error.message, true);
      } else {
        this.follower = response?.follower || this.follower;
      }
  
      this.isLoading = false;
   } 
  
  }

  isFollowing(): boolean {
    
    return Boolean(this.follower?.created_at && !this.follower?.canceled_at);
  }

  async isSame(): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      if (this.user && await this.userSessionSvc.isUser(this.user.id)) {
        this.toastSvc.show('common.follow.same', true);
        resolve(true);
    }

      resolve(false)
    })
  }
}
