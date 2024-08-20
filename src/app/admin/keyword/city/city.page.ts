import {Component, OnInit} from '@angular/core';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector} from '../../../models/sector.model';
import { AlertSvc } from '../../../services/alert.service';
import { ToastSvc } from '../../../services/toast.service';
import { LoadingSvc } from '../../../services/loading.service';
import { Location } from '@angular/common'

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
  host: {ngSkipHydration: 'true'},
})

export class CityPage implements OnInit {

  isLoading: boolean = false;
  CityKeys: CityKeys[] | undefined
  CityKeys_filtered: CityKeys[] | undefined
  sectors: ISector[] | undefined
  filter: string | undefined

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

  locations: any =  [];
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private location: Location,
  ) {
  }

  async ngOnInit() {
    await this.readLocations();
    
    await this.search();
  }

  async readLocations(){
    this.keywordService.getLocationKeywords().then(async (response: any) => {
    this.locations =response.response;

    })
    
  }

  search_filter(event?: any){
    this.CityKeys = this.CityKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      if ( this.CityKeys )
      this.CityKeys = this.CityKeys.filter((sector: any) => {
        if ( sector?.link !== '' && sector?.link !== undefined && sector?.link !== null){
          if ( this.filter )
          return sector?.link?.toLowerCase().includes(this.filter.toLowerCase());
        }
      })
    } else {
      this.CityKeys = this.CityKeys_filtered;
    }
  } 
  async search(event?: any) {
    this.isLoading = true;
    this.keywordService.getCityKeywords().then(async (response: any) => {
      this.CityKeys =response.response;
      this.CityKeys_filtered = this.CityKeys;
     
      this.isLoading = false;
    })
  
  
  }

  removeAccents(inputString: any) {
    // Normalize accented characters to their base form
    const normalizedString = inputString?.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    return normalizedString;
  }

  /**
     * Close modal
     */
  public goBack(): void {
    this.location.back();
  }


  async create(title: string, link: string, h1: string,  pagetitle: string, metadescription: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (title && link) {
      try {

        let linkParse;
        linkParse = link?.replace(new RegExp(' ', 'g'), '-').toLowerCase();
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

        // await this.keywordService.updateCityKeyword({location:  this.keyCity.locations_id.id, city: title,  link: linkParse, h1, pagetitle, metadescription});
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
