import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from 'src/app/services/http.service';
import { IAdviseFull, IAdviseFilter, IAdvise } from '../models/advises.model';

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
    return this.http.post( 'posts/oracle', advise )
  }

  // To Get a Post
  async get( id: number ): Promise<IHttpService>
  {
    return this.http.get( 'posts/oracle/' + id )
  }

  // To Update a Post
  async update( id: number, advise: IAdviseFull ): Promise<IHttpService>
  {
    return this.http.post( 'posts/oracle/' + id, advise )
  }

  // To Inform a Post reaction
  async react( id: number, react: number, state: number ): Promise<IHttpService>
  {
    return this.http.patch( `posts/oracle/${id}/react`, { react, state })
  }

  // To Inform a Post has been shared
  async shared( id: number ): Promise<IHttpService>
  {
    return this.http.put( `posts/oracle/${id}/shared`)
  }

  // To Delete a Post
  async delete( id: number ): Promise<IHttpService>
  {
    return this.http.delete( 'posts/oracle/' + id )
  }

  // To Get Posts based on Filter
  async list( filter: IAdviseFilter ): Promise<IHttpService>
  {
    return this.http.get( 'posts/oracles', filter )
  }

  // To Issue Tokens to User every Posts' `n` Visualizations
  async issue( id: number ): Promise<IHttpService>
  {
    return this.http.post( 'visitors/posts/oracle/' + id )
  }

  extractTitle( iAdvise: IAdvise ): string
  {
    return iAdvise.title ? iAdvise.title
      : !iAdvise?.content
        ? null : this.first( iAdvise.content )
  }

  extractSummary( iAdvise: IAdvise ): string
  {
    return iAdvise.summary ? iAdvise.summary
      : !iAdvise?.content ? null
        : iAdvise?.title ? iAdvise.content : this.after( iAdvise.content)
  }

  private first( str ): string
  {
    str = this.html2str( str )
    return str.substring( 0, Math.max( 0, this.html2str( str ).indexOf( '.' )))
  }

  private after( str ): string
  {
    str = this.html2str( str )
    return str.substring( Math.max( 0, this.html2str( str ).indexOf( '.' ) +1 ))
  }

  private html2str( html: string ): string
  {
    return !html ? '' : html.replace( /(<([^>]+)>)/g, "" )
  }
}
