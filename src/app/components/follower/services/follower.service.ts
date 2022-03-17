import { Injectable } from '@angular/core';
import { IPaginationFilter } from 'src/app/models/pagination.model';
import { HttpService, IHttpService } from 'src/app/services/http.service';
import { IFollower } from '../models/follower.model';

@Injectable({
  providedIn: 'root',
})
export class FollowerService {

  constructor(
      private http: HttpService
  ) {}
  
  // To Create a Follow
  async create( follower: IFollower ): Promise<IHttpService>
  {
    return this.http.post( 'followers', follower )
  }

  // To Get a Follow
  async get( uid_follower: number, uid_followed: number ): Promise<IHttpService>
  {
    return this.http.get( 'followers', { uid_follower: uid_follower, uid_followed: uid_followed })
  }

  // To Get Follows based on Filter
  async list( filter: IPaginationFilter ): Promise<IHttpService>
  {
    return this.http.get( 'followers', filter )
  }

  // To Update a Follow
  async update( id: number, follower: IFollower ): Promise<IHttpService>
  {
    return this.http.patch( 'followers/' + id, follower )
  }

  // To Toggle a Follow
  async toggle( follower: IFollower ): Promise<IHttpService>
  {
    return this.http.patch( 'followers', follower )
  }

  // To Delete a Follow
  async delete( id: number ): Promise<IHttpService>
  {
    return this.http.delete( 'followers/' + id )
  }
}
