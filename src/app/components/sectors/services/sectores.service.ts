import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ISector } from '../../../models/sector.model';

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

    async get( addAll: boolean = true )
    {
        if( this.list.length == 0 )
            this.list = [
                ...( !addAll ? [] : [{
                    id: 0,
                    nombre: 'Todas',
                }])
                , ...(( await this.httpSvc.get( 'sectores' )).response || [])
            ];

        return this.list;
    }
}
