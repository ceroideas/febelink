import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SectorService } from './services/sectores.service';
import { ISector, ISubSector } from '../../models/sector.model';
import { SubsectorService } from './services/subsectores.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.scss'],
})
export class SectorsComponent implements OnInit {
  @Output() OnSectorChange: EventEmitter<number> = new EventEmitter();
  @Output() OnSubsectorChange: EventEmitter<number> = new EventEmitter();

  @Output() OnGotSectors: EventEmitter<ISector[]> = new EventEmitter();
  @Output() OnGotSubsectors: EventEmitter<ISubSector[]> = new EventEmitter();

  @Output() OnCloseSector: EventEmitter<any> = new EventEmitter();
  @Output() OnCloseSubsector: EventEmitter<any> = new EventEmitter();

  sectors: ISector[] = [];
  subsectors: ISubSector[] = [];
  @Input() showSector: boolean = true;
  @Input() sector: number | undefined;
  @Input() subsector: number | undefined;
  sectorSlctd: ISector | undefined;
  subsectorSlctd: ISubSector | undefined;

  constructor(
    private sectorSvc: SectorService,
    private subsectorSvc: SubsectorService
  ) {}

  ngOnInit() {
    this.load(this.sector);
  }

  ionViewDidLeave() {
    this.reset();
  }

  load(idSector?: number) {
    if (this.showSector) {
      this.sectorSvc
        .get(false)
        .then((sectors) => this.autoselectSector(sectors));
      this.subsectorSvc
        .get(idSector)
        .then((subsectors: any) => this.autoselectSubsector(subsectors));
    } else {
      this.subsectorSvc
        .sectorsNsub()
        .then((sectorsNsub: any) => this.autoselectSubsector(sectorsNsub));
    }
  }

  autoselectSector(list: ISector[]) {
    this.sectors = list;

    if (this.sector)
      list.forEach((item: any ) => {
        if (item.id == this.sector) this.sectorSlctd = item;
      });

    this.OnGotSectors.emit(list);
  }

  autoselectSubsector(list: ISubSector[]) {
    this.subsectors = list;

    if (this.subsector)
      list.forEach((item: ISubSector) => {
        if (item.id == this.subsector) this.subsectorSlctd = item;
      });

    this.OnGotSubsectors.emit(list);
  }

  set(sector?: number, subsector?: number) {
    this.sector = sector || 0;
    this.subsector = subsector || 0;
  }

  async onChangeSector(event?: any) {
    this.sector = event.value?.id;
    this.subsector = undefined;
    this.subsectors = [];
    if (this.OnSectorChange) this.OnSectorChange.emit(this.sector);
    this.subsectors = await this.subsectorSvc.get(
      !this.showSector ? undefined : this.sector !== undefined ? this.sector : undefined

    );
  }

  async onChangeSubsector(event: any) {
    this.subsector = event.value?.id;
    if (this.OnSubsectorChange) this.OnSubsectorChange.emit(this.subsector);
    if (!this.showSector) this.sector = this.subsectorSlctd?.id_sector;
  }

  /* OnClose */
  onCloseSector(event: any) {
    this.OnCloseSector.emit(event);
  }
  onCloseSubsector(event: any) {
    this.OnCloseSubsector.emit(event);
  }

  // Remove Selection
  clear() {
    this.sector = undefined;
    this.subsector = undefined;
  }

  // Get Lists Again
  reset() {
    this.clear();
    this.sectors = [];
    this.subsectors = [];
    this.sectorSlctd = undefined;
    this.subsectorSlctd = undefined;
    this.load();
  }
}
