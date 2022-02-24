import { Injectable } from '@angular/core';
import { ISubSector } from '../../../models/sector.model';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class SubsectorService
{

    list: ISubSector[] = [];
    
    constructor(
        private httpSvc: HttpService
    ){}

    ionViewDidLeave()
    {
      this.list = [];
    }

    async get( id: number = 0 )
    {
        this.list = [{
                id: 0,
                nombre: 'Todas',
                id_sector: 0
            }
            , ...(( await ( await this.httpSvc.get( 'sub-sectores/' + id )).toPromise()).response || [])
        ];

        return this.list;
    }
}
