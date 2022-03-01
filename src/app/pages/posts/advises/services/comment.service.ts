import { Injectable } from '@angular/core';
import { IPaginationFilter } from 'src/app/models/pagination.model';
import { HttpService, IHttpService } from 'src/app/services/http.service';
import { IComment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  constructor(
      private http: HttpService
  ) {}
  
  // To Create a Comment
  async create( comment: IComment ): Promise<IHttpService>
  {
    return this.http.post( `posts/advise/comment`, comment )
  }

  // To Update a Comment
  async update( id: number, comment: IComment ): Promise<IHttpService>
  {
    return this.http.put( `posts/advise/comment/${id}`, comment )
  }

  // To Inform a Comment reaction
  async react( id: number, react: number, state: number ): Promise<IHttpService>
  {
    return this.http.patch( `posts/advise/comment/${id}/react`, { react, state })
  }

  // To Delete a Comment
  async delete( id: number ): Promise<IHttpService>
  {
    return this.http.delete( `posts/advise/comment/${id}` )
  }

  // To Get Comments based on Filter
  async list( post: number, filter: IPaginationFilter ): Promise<IHttpService>
  {
    return this.http.get( `posts/advises/${post}/comments`, filter )
  }
}
