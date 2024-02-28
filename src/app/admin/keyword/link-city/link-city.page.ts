import {Component, OnInit} from '@angular/core';
import {AlertSvc} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector} from '../../../models/sector.model';

interface LinkCityKeys {
  id: number, 
  id_locations: {
    id: '',
    title: '',
  },
  id_city: {
    id: '',
    title: '',
  },
  sector_id: {
    id: '',
    name: '',
  },
  // id_locations: {
  //   id: '',
  //   title: '',
  // },
  title: string,
  link: string,
  pageTitle: string,
  h1: string,
  h2: string,
  description: string,
  isEdit: boolean
}

@Component({
  selector: 'link-city-page',
  templateUrl: './link-city.page.html',
  styleUrls: ['./link-city.page.scss'],
})

export class LinkCityPage implements OnInit {

  isLoading: boolean = false;
  LinkCityKeys: LinkCityKeys[];
  sectors: ISector[];
  filter: string;

  showCreatekeyword: boolean = false;

  linkcity: any =[];
  linkcity_filtered: any =[];
  locations: [];
  citys: [];

  keyLinkCity: any =  {
    id: '',
    city: '',
    sector_id: {
      id: '',
      name: '',
    },
    locations_id: {
      id: '',
      title: '',
    },
    citys_id: {
      id: '',
      name: '',
    },
    title: '',
    link: '',
    pagetitle: '',
    h1: '',
    h2: '',
    description: '',
  }
  locationSelect: number;
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private sectorService: SectorService
  ) {
  }

  async ngOnInit() {
    await this.readSector();
    // await this.readCitys();
    await this.readLocations()
    await this.search();
  }

  async readSector(){
    const {response} = await this.keywordService.getSectorKeywords();
    this.sectors = response;
  }
  // async readCitys(){
  //   const {response} = await this.keywordService.getCityKeywords();
  //   this.locations = response;
  // }
  async readLocations(){
    const {response} = await this.keywordService.getLocationKeywords();
    this.locations = response;
  }
  async readCitysLocation(){
    const {response} = await this.keywordService.getCityLocation(this.locationSelect);
    console.log(response)
    this.citys = response;
  }

  search_filter(event?: any){
    this.linkcity = this.linkcity_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.linkcity = this.linkcity.filter((sector) => {
        return sector.link.toLowerCase().includes(this.filter.toLowerCase());
      })
    } else {
      this.linkcity = this.linkcity_filtered;
    }
  } 

  onLocationChange($event?: any){
this.locationSelect = $event;
this.readCitysLocation()
  }

  async search(event?: any) {
    this.isLoading = true;
    const {response} = await this.keywordService.getLinkCityKeywords();
    this.linkcity = response;
    this.linkcity_filtered = this.linkcity;

    this.isLoading = false;
  }

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedString;
  }


 
  async create(sector: string, location: string, city: string, title: string,  link: string, pagetitle: string, h1: string, h2: string, description: string ) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && location  && city && link && pagetitle && h1 && h2 && description) {
      try {


        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        

        await this.keywordService.addLinkCityKeyword({sector: parseInt(sector), location: parseInt(location), city:  parseInt(city),title,  link: linkParse, pagetitle, h1, h2, description});
        await this.search();
        this.restoreData();
      } catch (e) {}
    } else {
      if (!await this.alertSvc.confirm({
        title: 'Formulario Incompleto',
        msg: `Rellena todos los datos que son obligatorios`
      })) {
        return; // Cancel button
      }
    }
  }
  async showEdit(keys: LinkCityKeys) {

    this.keyLinkCity = JSON.parse(JSON.stringify(keys));
    this.locationSelect = this.keyLinkCity.locations_id.id;
    this.readCitysLocation()

    let searchText;
    searchText = this.keyLinkCity.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keyLinkCity.link = searchText;
    this.showCreatekeyword = true;

  }

  restoreData(){
    this.keyLinkCity =  {
      id: '',
      city: '',
      sector_id: {
        id: '',
        name: '',
      },
      locations_id: {
        id: '',
        name: '',
      },
      citys_id: {
        id: '',
        name: '',
      },
      linklocation: '',
      title: '',
      link: '',
      pagetitle: '',
      h1: '',
      h2: '',
      description: '',
    }
    this.showCreatekeyword = false;
  }
  async edit(sector: string, location: string, city: string, title: string,  link: string, pagetitle: string, h1: string, h2: string, description: string ) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && title && link && pagetitle && h1 && h2 && description) {
      try {
        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        
        await this.keywordService.updateLinkCityKeyword({linkcity:  parseInt(this.keyLinkCity.id) ,sector: parseInt(sector), location: parseInt(location), city:  parseInt(city),title,  link: linkParse, pagetitle, h1, h2, description});
        await this.search();
        this.restoreData();
      } catch (e) {}
    } else {
      if (!await this.alertSvc.confirm({
        title: 'Formulario Incompleto',
        msg: `Rellena todos los datos que son obligatorios`
      })) {
        return; // Cancel button
      }
    }
  }

  async delete(keys: LinkCityKeys) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    }

    try {
      if (!await this.alertSvc.confirm({
        title: 'Eliminar Ubicacion',
        msg: `¿Confirma que desea eliminar el link: '${keys.title}' ?`
      })) {
        return; // Cancel button
      }

      this.isLoading = true;
      await this.loadingSvc.show();

      await this.keywordService.removeLinkCityKeyword(keys.id);

      await this.toastSvc.show(`El link '${keys.title}' ha sido eliminado con éxito.`, true);
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
