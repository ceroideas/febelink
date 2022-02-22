import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from 'src/app/services/http.service';
import { IAdviseFull, IAdviseFilter } from '../models/advises.model';

@Injectable({
  providedIn: 'root',
})
export class AdviseService {

  constructor(
      private http: HttpService
  ) {}
  
  // To Create a Post
  async create( advise: IAdviseFull ): Promise<IHttpService>
  {
    return ( await this.http.post( 'posts/advise', advise )).toPromise()
  }

  // To Get a Post
  async get( id: number ): Promise<IHttpService>
  {
    return ( await this.http.get( 'posts/advise/' + id )).toPromise()
  }

  // To Update a Post
  async update( id: number, advise: IAdviseFull ): Promise<IHttpService>
  {
    return ( await this.http.patch( 'posts/advise/' + id, advise )).toPromise()
  }

  // To Inform a Post reaction
  async react( id: number, react: number, state: number ): Promise<IHttpService>
  {
    return ( await this.http.patch( `posts/advise/${id}/react`, { react, state })).toPromise()
  }

  // To Inform a Post has been shared
  async shared( id: number ): Promise<IHttpService>
  {
    return ( await this.http.put( `posts/advise/${id}/shared`)).toPromise()
  }

  // To Delete a Post
  async delete( id: number ): Promise<IHttpService>
  {
    return ( await this.http.delete( 'posts/advise/' + id )).toPromise()
  }

  // To Get Posts based on Filter
  async list( filter: IAdviseFilter ): Promise<IHttpService>
  {
    return ( await this.http.get( 'posts/advises', filter )).toPromise()
  }
}
