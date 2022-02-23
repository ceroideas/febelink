import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ISector, ISubSector } from 'src/app/models/sector.model';
import { SubsectorService } from 'src/app/components/sectors/services/subsectores.service';
import { SectorService } from './services/sectores.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.scss'],
})
export class SectorsComponent implements OnInit
{
  @Output() OnSectorChange: EventEmitter<number> = new EventEmitter()
  @Output() OnSubsectorChange: EventEmitter<number> = new EventEmitter()

  sectors: ISector[] = []
  subsectors: ISubSector[] = []
  sector: number = null
  subsector: number = null

  constructor(
      private sectorSvc: SectorService
    , private subsectorSvc: SubsectorService
  ) { }

  ngOnInit()
  {
    this.load()
  }

  ionViewDidLeave()
  {
    this.reset()
  }

  load( idSector?: number ) {
    this.sectorSvc.get().then( sectors => this.sectors = sectors )
    this.subsectorSvc.get( idSector || 0 )
      .then( subsectors => this.subsectors = subsectors )
  }

  set( sector?: number , subsector?: number )
  {
    this.sector = sector || 0
    this.subsector = subsector || 0
  }

  async onChangeSector( id )
  {
    this.sector = id
    this.subsector = null
    this.subsectors = []
    if( this.OnSectorChange ) this.OnSectorChange.emit( id )
    this.subsectors = await this.subsectorSvc.get( id )
  }

  async onChangeSubsector( id )
  {
    this.subsector = id
    if( this.OnSubsectorChange ) this.OnSubsectorChange.emit( id )
  }

  // Remove Selection
  clear()
  {
    this.sector = null
    this.subsector = null
  }

  // Get Lists Again
  reset()
  {
    this.clear()
    this.sectors = []
    this.subsectors = []
    this.load()
  }
}
