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

  extractTitle( iAdvise: IAdvise ): string
  {
    return iAdvise.title ? iAdvise.title
      : !iAdvise?.content
          ? null
          : this.firstSentence( iAdvise.content )
          // : iAdvise.content.substring( 0, Math.max( 0, iAdvise.content.indexOf( '.' )))
  }

  extractSummary( iAdvise: IAdvise ): string
  {
    return iAdvise.summary ? iAdvise.summary
      : !iAdvise?.content ? null
        : iAdvise?.title ? iAdvise.content
          : iAdvise.content?.replace( this.firstSentence( iAdvise.content ) || '', '' )
          // : iAdvise.content.substring( Math.max( 0, iAdvise.content.indexOf( '.' ) +1 ))
  }

  private firstSentence( str ): string
  {
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_Expressions
    //const ar = !str ? '' : str.replace(/\.(?!\d)|([^\d])\.(?=\d)/g,'$1.|')

    // https://regex101.com/r/nG1gU7/27
    // const ar = !str ? '' : str.replace( /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/gm );
    const ar = !str ? '' : str.replace( /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!\:)\s+|\p{Cc}+|\p{Cf}+/gm );
    return ar
  }
}
