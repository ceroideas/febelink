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

    async get( addAll: boolean = true )
    {
        if( this.list.length == 0 )
            this.list = [
                ...( !addAll ? [] : [{
                    id: 0,
                    nombre: 'Todas',
                }])
                , ...(( await ( await this.httpSvc.get( 'sectores' )).toPromise()).response || [])
            ];

        return this.list;
    }
}
