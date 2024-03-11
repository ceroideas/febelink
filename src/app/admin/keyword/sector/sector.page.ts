import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AlertSvc} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector, Sector} from '../../../models/sector.model';

interface SectorKeys {
  id: number,
  sector_id: number,
  key_name: string,
  nombre: string,
  search_term: string,
  icons: string,
  isEdit: boolean
}

@Component({
  selector: 'sector-page',
  templateUrl: './sector.page.html',
  styleUrls: ['./sector.page.scss'],
})

export class SectorPage implements OnInit {

  @ViewChild('newKeywordSector', { static: true }) newKeywordSector: ElementRef;
  isLoading: boolean = false;
  sectorKeys: SectorKeys[];
  sectorKeys_filtered: SectorKeys[];
  sectors: Sector[];
  filter: string;

  showCreatekeyword: boolean = false;


  icons = [
    {path: 'assets/imgs/home/services-assistant.svg'},
    {path: 'assets/imgs/home/services-sport.svg'},
    {path: 'assets/imgs/home/services-beauty.svg'},
    {path: 'assets/imgs/home/services-learning.svg'},
    {path: 'assets/imgs/home/services-reforms.svg'},
    {path: 'assets/imgs/home/services-entertainment.svg'},
    {path: 'assets/imgs/home/services-development.svg'},
    {path: 'assets/imgs/home/services-health.svg'},
    {path: 'assets/imgs/home/services-lawyer.svg'},
    {path: 'assets/imgs/home/services-car.svg'},
  ]

  keySector: any =  {
    sector: '',
    nombre: '',
    search_term: '',
    icon: '',
  }
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private sectorService: SectorService
  ) {
  }

  async ngOnInit() {
    // this.sectors = await this.sectorService.get();
    await this.search();
  }


  async search(event?: any) {
    this.isLoading = true;
    // this.filter = event?.target?.value || this.filter || '';
    const {response} = await this.keywordService.getSectorKeywords();
    this.sectorKeys = response;
    this.sectorKeys_filtered = this.sectorKeys;
  
    // this.totalRecords = response.totalRecords;
    // this.recordsPerPage = response.limit;
    // this.qPages = response.qPages;
    this.isLoading = false;


  }

  search_filter(event?: any){
    this.sectorKeys = this.sectorKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.sectorKeys = this.sectorKeys.filter((sector) => {
        if ( sector?.search_term !== '' && sector?.search_term !== undefined && sector?.search_term !== null){
          return sector?.search_term?.toLowerCase().includes(this.filter.toLowerCase());
        }
      })
    } else {
      this.sectorKeys = this.sectorKeys_filtered;
    }
  }

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    return normalizedString;
  }

  async create(sector: string, keyword: string, icon: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && keyword && icon) {
      try {

        let keywordParse;
        keywordParse = keyword.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        keywordParse= this.removeAccents(keywordParse)
        
        await this.keywordService.addSectorKeyword({name: sector, searchTerm: keywordParse, icon: icon});
        this.keySector = {};
        await this.search();
        this.restoreData();
      } catch (e) {
        console.error(e);
      }
    } else {
      if (!await this.alertSvc.confirm({
        title: 'Formulario Incompleto',
        msg: `Rellena todos los datos que son obligatorios`
      })) {
        return; // Cancel button
      }
    }
  }

  async edit(sector: string, keyword: string , icon: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && keyword && icon) {
      try {

        let keywordParse;
        keywordParse = keyword.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        keywordParse= this.removeAccents(keywordParse)

        await this.keywordService.updateSectorKeyword({sector:this.keySector.id,  name: sector, searchTerm: keywordParse, icon:  icon});
        this.keySector = {};
        await this.search();
        this.restoreData();
      } catch (e) {
        console.error(e);
      }
    } else {
      if (!await this.alertSvc.confirm({
        title: 'Formulario Incompleto',
        msg: `Rellena todos los datos que son obligatorios`
      })) {
        return; // Cancel button
      }
    }
  }

  async showEdit(keys: SectorKeys) {
    this.keySector = JSON.parse(JSON.stringify(keys));
    let searchText;
    searchText = this.keySector.search_term.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keySector.search_term = searchText;
    this.showCreatekeyword = true;

  }

  restoreData(){
    this.keySector =  {
      sector: '',
      nombre: '',
      search_term: '',
      icon: '',
    }
    this.showCreatekeyword = false;
  }

  async delete(keys: SectorKeys) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    }

    try {
      if (!await this.alertSvc.confirm({
        title: 'Eliminar Sector',
        msg: `¿Confirma que desea eliminar el Sector: '${keys.nombre}' ?`
      })) {
        return; // Cancel button
      }

      this.isLoading = true;
      await this.loadingSvc.show();

      await this.keywordService.removeSectorKeyword(keys.id);

      await this.toastSvc.show(`el Sector '${keys.key_name}' ha sido eliminado con éxito.`, true);
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

  selectIconSector(icon) {
    this.icons.forEach((iconItem: { path: string; selected: boolean }) => iconItem.selected = false);
    icon.selected = true;
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
