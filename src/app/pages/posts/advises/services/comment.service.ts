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
  async create( oracle: number, comment: IComment ): Promise<IHttpService>
  {
    return this.http.post( `posts/oracle/${oracle}/comment`, comment )
  }

  // To Update a Comment
  async update( oracle: number, id: number, comment: IComment ): Promise<IHttpService>
  {
    return this.http.put( `posts/oracle/${oracle}/comment/${id}`, comment )
  }

  // To Delete a Comment
  async delete( oracle: number, id: number ): Promise<IHttpService>
  {
    return this.http.delete( `posts/oracle/${oracle}/comment/${id}` )
  }

  // To Get Comments based on Filter
  async list( oracle: number, filter: IPaginationFilter ): Promise<IHttpService>
  {
    return this.http.get( `posts/oracle/${oracle}/comments`, filter )
  }
}
