import { Component, OnInit } from '@angular/core';
import { ISector, ISubSector } from 'src/app/models/sector.model';
import { SubsectorService } from 'src/app/services/subsectores.service';
import { SectorService } from './services/sectores.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.scss'],
})
export class SectorsComponent implements OnInit
{
  sectors: ISector[] = []
  subsectors: ISubSector[] = []
  sector: ISector
  subsector: ISubSector

  constructor(
      private sectorSvc: SectorService
    , private subsectorSvc: SubsectorService
  ) { }

  ngOnInit() {}

  ionViewDidLeave()
  {
    this.reset()
  }

  load( idSector?: number ) {
    this.sectorSvc.get().then( sectors => this.sectors = sectors )
    this.subsectorSvc.get( idSector || 0 )
      .then( subsectors => this.subsectors = subsectors )
  }

  async onChangeSector( event )
  {
    this.subsector = null;
    this.subsectors = [];
    this.subsectors = await this.subsectorSvc.get(event.detail.value);
    console.log({ sectors: this.sectors, subsectors: this.subsectors });
  }

  reset()
  {
    this.sectors = []
    this.sector = null
    
    this.subsectors = []
    this.subsector = null
  }

}
