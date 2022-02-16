import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { IAdvise, IAdviseFilter } from '../models/advises.model';

@Injectable({
  providedIn: 'root',
})
export class AdviseService {

  constructor(
      private http: HttpService
  ) {}

  async get( id: number ): Promise<{ response, error }>
  {
    return this.http.get( 'posts/advise/' + id )
  }

  async update( id: number ): Promise<{ response, error }>
  {
    return this.http.patch( 'posts/advise/' + id )
  }

  async delete( id: number )
  {
    return this.http.delete( 'posts/advise/' + id )
  }

  async list( filter: IAdviseFilter )
  {
    return this.http.get( 'post/advises', filter )
  }
}
