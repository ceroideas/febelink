import { Injectable } from '@angular/core';
import { ISector } from '../../../models/sector.model';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SectorService
{

    list: ISector[] = [];
    
    constructor(
        private httpSvc: HttpService
    ){}

    ionViewDidLeave()
    {
      this.list = [];
    }

    async get()
    {
        if( this.list.length == 0 )
            this.list = [
                {
                    id: 0,
                    nombre: 'Todas',
                }
                , ...( await this.httpSvc.get( 'sectores' )).response
            ];

        return this.list;
    }
}
