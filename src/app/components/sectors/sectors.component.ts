import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() showSector: boolean = true
  @Input() sector: number = null
  @Input() subsector: number = null
  sectorSlctd: ISector = null
  subsectorSlctd: ISubSector = null

  constructor(
      private sectorSvc: SectorService
    , private subsectorSvc: SubsectorService
  ) { }

  ngOnInit()
  {
    this.load( this.sector )
  }

  ionViewDidLeave()
  {
    this.reset()
  }

  load( idSector?: number ) {
    if( this.showSector )
    {
      this.sectorSvc.get( false ).then( sectors => this.sectors = sectors )
      this.subsectorSvc.get( idSector )
        .then( subsectors => this.subsectors = subsectors )
    } else
    {
      this.subsectorSvc.sectorsNsub()
        .then( sectorsNsub => this.subsectors = sectorsNsub )
    }
  }

  set( sector?: number , subsector?: number )
  {
    this.sector = sector || 0
    this.subsector = subsector || 0
  }

  async onChangeSector( event? )
  {
    this.sector = event.value?.id
    this.subsector = null
    this.subsectors = []
    if( this.OnSectorChange ) this.OnSectorChange.emit( this.sector )
    this.subsectors = await this.subsectorSvc.get( !this.showSector ? null : this.sector )
  }

  async onChangeSubsector( event )
  {
    this.subsector = event.value?.id
    if( this.OnSubsectorChange ) this.OnSubsectorChange.emit( this.subsector )
    if( !this.showSector ) this.sector = this.subsectorSlctd.id_sector
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
    this.sectorSlctd = null
    this.subsectorSlctd = null
    this.load()
  }
}
