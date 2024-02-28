import {Component, OnInit} from '@angular/core';
import {AlertSvc} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector} from '../../../models/sector.model';

interface CityKeys {
  id: number, 
  locations_id: {
    id: '',
    title: '',
  },
  city : number, 
  title: string,
  link: string,
  page_title: string,
  meta_description: string,
  isEdit: boolean
}

@Component({
  selector: 'city-page',
  templateUrl: './city.page.html',
  styleUrls: ['./city.page.scss'],
})

export class CityPage implements OnInit {

  isLoading: boolean = false;
  CityKeys: CityKeys[];
  CityKeys_filtered: CityKeys[];
  sectors: ISector[];
  filter: string;

  showCreatekeyword: boolean = false;
  keyCity: any =  {
    id: '',
    city: '',
    title: '',
    link: '',
    page_title: '',
    meta_description: '',
    locations_id: {
      id: '',
      title: '',
    },
  }

  locations: [];
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private sectorService: SectorService
  ) {
  }

  async ngOnInit() {
    await this.readLocations();
    this.sectors = await this.sectorService.get();
    await this.search();
  }

  async readLocations(){
    const {response} = await this.keywordService.getLocationKeywords();
    this.locations = response;
  }

  search_filter(event?: any){
    this.CityKeys = this.CityKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.CityKeys = this.CityKeys.filter((sector) => {
        return sector.link.toLowerCase().includes(this.filter.toLowerCase());
      })
    } else {
      this.CityKeys = this.CityKeys_filtered;
    }
  } 
  async search(event?: any) {
    this.isLoading = true;
    const {response} = await this.keywordService.getCityKeywords();
    console.log(response)
    this.CityKeys = response;
    this.CityKeys_filtered = this.CityKeys;
   
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
        

        await this.keywordService.addCityKeyword({location: this.keyCity.locations_id.id, title , link: linkParse, h1, pagetitle, metadescription});
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
  async showEdit(keys: CityKeys) {
    this.keyCity = JSON.parse(JSON.stringify(keys));
    let searchText;
    searchText = this.keyCity.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keyCity.link = searchText;
    this.showCreatekeyword = true;
  }

  restoreData(){
    this.keyCity =  {
      id: '',
      locations_id: {
        id: '',
        title: '',
      },
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

        await this.keywordService.updateCityKeyword({location:  this.keyCity.locations_id.id, city: title,  link: linkParse, h1, pagetitle, metadescription});
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

  async delete(keys: CityKeys) {
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

      await this.keywordService.removeCityKeyword(keys.id);

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
