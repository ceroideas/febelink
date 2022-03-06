import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class PostStatsSvc {

  constructor(
      private http: HttpService
  ) {}
  
  // To Get Total Qant Posts done By User
  async getQPosts( uid: number ): Promise<IHttpService>
  {
    return this.http.get( `posts/oracles/stats/qantPOSTsByUser/${uid}` )
  }
  
  // To Get Total Reacts to every Post done By User
  async getQReactsToPOST( uid: number ): Promise<IHttpService>
  {
    return this.http.get( `posts/oracles/stats/qantReactsToPOSTsByUser/${uid}` )
  }
  
  // To Get Stats about Posts By User
  async getQs( uid: number ): Promise<IHttpService>
  {
    return this.http.get( `posts/oracles/stats/qantsByUser/${uid}` )
  }
}
