import { IUser } from 'src/app/models/user.model';
import { Component, Input, OnInit } from '@angular/core';
import { FollowerService } from '../services/follower.service';
import { IFollower } from '../models/follower.model';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { ToastSvc } from 'src/app/services/toast.service';

@Component({
  selector: 'app-follower-button',
  templateUrl: './follower-button.component.html',
  styleUrls: ['./follower-button.component.scss'],
})
export class FollowerButtonComponent implements OnInit {

  @Input() user: IUser
  @Input() clase: string
  @Input() follower: IFollower

  isLoading: boolean = false

  constructor(
    private userSessionSvc: UserSessionSvc,
    private followerSvc: FollowerService,
    private toastSvc: ToastSvc,
  ) {}

  ngOnInit()
  {
    this.get()
  }

  async get()
  {
    this.isLoading = true

    const { response, error } = await this.followerSvc.get(
      await this.userSessionSvc.id(),
      this.user?.id
    )

    if( response ) this.follower = response
    else this.follower = {
      uid_follower: await this.userSessionSvc.id(),
      uid_followed: this.user.id,

      created_at: null,
      canceled_at: null
    } as IFollower

    console.log({ response, error })
    
    this.isLoading = false
  }

  async toggleFollow()
  {
    // Wait until previous process to finish
    if( this.isLoading ) return

    // Can't follow themselves
    if( await this.isSame() ) return

    this.isLoading = true

    const { response, error } = await this.followerSvc.toggle( this.follower )
    if( error ) this.toastSvc.show( error.message, true )
    else this.follower = response?.follower || this.follower

    this.isLoading = false
  }

  isFollowing(): boolean
  {
    return this.follower?.created_at && !this.follower?.canceled_at
  }

  async isSame(): Promise<boolean>
  {
    return new Promise<boolean>( async resolve => {
      if( await this.userSessionSvc.isUser( this.user.id )) {
        this.toastSvc.show( 'common.follow.same', true )
        resolve( true )
      }

      resolve( false )
    })
  }
}
