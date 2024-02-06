import {Component, OnInit} from '@angular/core';
import {AlertSvc} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector} from '../../../models/sector.model';

interface LocationKeys {
  id: number, 
  locations : number, 
  title: string,
  link: string,
  page_title: string,
  meta_description: string,
  isEdit: boolean
}

@Component({
  selector: 'location-page',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})

export class LocationPage implements OnInit {

  isLoading: boolean = false;
  LocationKeys: LocationKeys[];
  LocationKeys_filtered: LocationKeys[];
  sectors: ISector[];
  filter: string;

  showCreatekeyword: boolean = false;
  keyLocation: any =  {
    id: '',
    locations: '',
    title: '',
    link: '',
    page_title: '',
    meta_description: '',
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
    this.sectors = await this.sectorService.get();
    await this.search();
  }

  search_filter(event?: any){
    this.LocationKeys = this.LocationKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.LocationKeys = this.LocationKeys.filter((sector) => {
        return sector.link.toLowerCase().includes(this.filter.toLowerCase());
      })
    } else {
      this.LocationKeys = this.LocationKeys_filtered;
    }
  } 
  async search(event?: any) {
    this.isLoading = true;
    // this.filter = event?.target?.value || this.filter || '';
    const {response} = await this.keywordService.getLocationKeywords();
    this.LocationKeys = response;
    this.LocationKeys_filtered = this.LocationKeys;
    // this.totalRecords = response.totalRecords;
    // this.recordsPerPage = response.limit;
    // this.qPages = response.qPages;
    this.isLoading = false;
  }

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedString;
  }



  async create(title: string, link: string, h1: string,  pagetitle: string, metadescription: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (title && link) {
      try {

        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        

        await this.keywordService.addLocationKeyword({title , link: linkParse, h1, pagetitle, metadescription});
        await this.search();
        this.restoreData()
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
  async showEdit(keys: LocationKeys) {
    this.keyLocation = JSON.parse(JSON.stringify(keys));
    let searchText;
    searchText = this.keyLocation.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keyLocation.link = searchText;
    this.showCreatekeyword = true;
  }

  restoreData(){
    this.keyLocation =  {
      id: '',
      location: '',
      title: '',
      link: '',
      page_title: '',
      meta_description: '',
    }
    this.showCreatekeyword = false;
  }

  async edit(title: string, link: string, h1: string,  pagetitle: string, metadescription: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (title && link && h1 && pagetitle && metadescription) {
      try {
        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)

        await this.keywordService.updateLocationKeyword({locations: Number(this.keyLocation.id), title , link: linkParse, h1, pagetitle, metadescription});
        await this.search();
        this.restoreData()
      } catch (e) {
        console.error(e);
      }
    } else {
      if (!await this.alertSvc.confirm({
        title: 'Formulario Incompleto',
        msg: `Rellena todos los datos que son obligatorios`
      })) {
        return;
      }
    }
    
  }

  async delete(keys: LocationKeys) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    }

    try {
      if (!await this.alertSvc.confirm({
        title: 'Eliminar Ubicacion',
        msg: `¿Confirma que desea eliminar la ubicacion: '${keys.title}' ?`
      })) {
        return; // Cancel button
      }

      this.isLoading = true;
      await this.loadingSvc.show();

      await this.keywordService.removeLocationKeyword(keys.id);

      await this.toastSvc.show(`La ubicacion '${keys.title}' ha sido eliminada con éxito.`, true);
      await this.loadingSvc.dismiss();

      await this.search();
    } catch (e) {
      this.isLoading = false;
      await this.loadingSvc.dismiss();
      await this.toastSvc.show('admin.location.delete.error', true);
    }
  }

  showToastLoading() {
    this.toastSvc.show('admin.location.loading', true);
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
