import {Component, OnInit} from '@angular/core';
import {AlertSvc} from '../../../services/alert.service';
import {LoadingSvc} from '../../../services/loading.service';
import {ToastSvc} from '../../../services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector} from '../../../models/sector.model';
import { Location } from '@angular/common'

interface LinkLocationKeys {
  id: number, 
  id_locations: {
    id: '',
    title: '',
  },
  id_sector: {
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
  selector: 'link-location-page',
  templateUrl: './link-location.page.html',
  styleUrls: ['./link-location.page.scss'],
  host: {ngSkipHydration: 'true'},
})

export class LinkLocationPage implements OnInit {

  isLoading: boolean = false;
  LinkLocationKeys: LinkLocationKeys[]  | undefined
  sectors: ISector[]  | undefined
  filter: string  | undefined

  showCreatekeyword: boolean = false;

  linklocations: any =[];
  linklocations_filtered: any =[];
  locations: any = [];
 

  keyLinkLocation: any =  {
    id: '',
    id_sector: {
      id: '',
      name: '',
    },
    locations_id: {
      id: '',
      title: '',
    },
   
    title: '',
    link: '',
    pagetitle: '',
    h1: '',
    h2: '',
    description: '',
  }
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private sectorService: SectorService,
    private location: Location,
  ) {
  }

  async ngOnInit() {
    await this.readSector();
    await this.readLocations();
    await this.search();
  }

  async readSector(){
    this.keywordService.getSectorKeywords().then(async (response: any) => {
      this.sectors = response.response;
    })

  }
  async readLocations(){
    this.keywordService.getLocationKeywords().then(async (response: any) => {
      this.locations = response.response;
    })
   
  }

  search_filter(event?: any){
    this.linklocations = this.linklocations_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.linklocations = this.linklocations.filter((sector:any) => {
        if ( sector?.link !== '' && sector?.link !== undefined && sector?.link !== null){
          if ( this.filter )
          return sector?.link?.toLowerCase().includes(this.filter.toLowerCase());
        }
      })
    } else {
      this.linklocations = this.linklocations_filtered;
    }
  } 

  async search(event?: any) {
    this.isLoading = true;
    this.keywordService.getLinkLocationKeywords().then(async (data: any) => {
      this.linklocations = data.response;
      this.linklocations_filtered = this.linklocations;

      this.isLoading = false;
    })
  }
  /**
     * Close modal
     */
  public goBack(): void {
    this.location.back();
  }

  removeAccents(inputString: any) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    return normalizedString;
  }


 
  async create(sector: string, location: string, title: string,  link: string, pagetitle: string, h1: string, h2: string, description: string ) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && title && link && pagetitle && h1 && h2 && description) {
      try {


        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        

        await this.keywordService.addLinkLocationKeyword({sector: parseInt(sector), locations: parseInt(location), title, link: linkParse, pagetitle, h1, h2, description});
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
  async showEdit(keys: LinkLocationKeys) {

    this.keyLinkLocation = JSON.parse(JSON.stringify(keys));
    let searchText;
    searchText = this.keyLinkLocation.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keyLinkLocation.link = searchText;
    this.showCreatekeyword = true;

  }

  restoreData(){
    this.keyLinkLocation =  {
      id: '',
      id_sector: {
        id: '',
        name: '',
      },
      locations_id: {
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
  async edit(sector: string, location: string, title: string,  link: string, pagetitle: string, h1: string, h2: string, description: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && title && link && pagetitle && h1 && h2 && description) {
      try {
        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        
        await this.keywordService.updateLinkLocationKeyword({linkLocations:  parseInt(this.keyLinkLocation.id) , sector: parseInt(sector), locations: parseInt(location), title, link: linkParse, pagetitle, h1, h2, description});
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

  async delete(keys: LinkLocationKeys) {
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

      await this.keywordService.removeLinkLocationKeyword(keys.id);

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
