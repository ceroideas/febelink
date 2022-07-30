import {Component, OnInit} from '@angular/core';
import {AlertSvc} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector, ISubSector} from '../../../models/sector.model';
import {SubsectorService} from '../../../components/sectors/services/subsectores.service';

interface SubSectorKeys {
  id: number,
  sub_sector_id: number,
  key_name: string,
  isEdit: boolean
}

@Component({
  selector: 'sub-sector-page',
  templateUrl: './subsector.page.html',
  styleUrls: ['./subsector.page.scss'],
})

export class SubSectorPage implements OnInit {

  isLoading: boolean = false;
  subSectorKeys: SubSectorKeys[];
  subSectors: ISubSector[];
  filter: string;

  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private subSectorService: SubsectorService
  ) {
  }

  async ngOnInit() {
    this.subSectors = await this.subSectorService.sectorsNsub();
    await this.search();
  }


  async search(event?: any) {
    this.isLoading = true;
    this.filter = event?.target?.value || this.filter || '';
    const {response} = await this.keywordService.getSubSectorKeywords(this.activePage, this.filter);
    this.subSectorKeys = response.items;
    this.totalRecords = response.totalRecords;
    this.recordsPerPage = response.limit;
    this.qPages = response.qPages;
    this.isLoading = false;
  }

  async create(subSectorId: string, keyword: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (subSectorId && keyword) {
      try {
        await this.keywordService.addSubSectorKeyword({subSectorId: parseInt(subSectorId), keyword});
        await this.search();
      } catch (e) {
        console.error(e);
      }
    }
  }

  async edit(keys: SubSectorKeys) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (keys) {
      try {
        await this.keywordService.updateSubSectorKeyword({id: keys.id, subSectorId: keys.sub_sector_id, keyword: keys.key_name});
        await this.search();
      } catch (e) {
        console.error(e);
      }
    }
  }

  async delete(keys: SubSectorKeys) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    }

    try {
      if (!await this.alertSvc.confirm({
        title: 'Eliminar palabra clave',
        msg: `¿Confirma que desea eliminar la palabra clave: '${keys.key_name}' ?`
      })) {
        return; // Cancel button
      }

      this.isLoading = true;
      await this.loadingSvc.show();

      await this.keywordService.removeSubSectorKeyword(keys.id);

      await this.toastSvc.show(`La palabra clave '${keys.key_name}' ha sido eliminada con éxito.`, true);
      await this.loadingSvc.dismiss();

      await this.search();
    } catch (e) {
      this.isLoading = false;
      await this.loadingSvc.dismiss();
      await this.toastSvc.show('admin.tokensUsers.delete.error', true);
    }
  }

  showToastLoading() {
    this.toastSvc.show('admin.tokensUsers.loading', true);
  }

  /* Pagination */
  totalRecords: number = 0;
  recordsPerPage: number = 1;
  qPages: number = 1;
  activePage: number = 1;

  displayActivePage(activePage: number) {
    this.activePage = activePage;
    this.search();
  }

}
