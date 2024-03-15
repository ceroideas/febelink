import {Component, OnInit} from '@angular/core';
import {AlertSvc} from 'src/app/services/alert.service';
import {LoadingSvc} from 'src/app/services/loading.service';
import {ToastSvc} from 'src/app/services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector} from '../../../models/sector.model';

interface LinkFooterKeys {
  id: number, 
  id_locations: {
    id: '',
    title: '',
  },
  id_footer: {
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
  selector: 'link-footer-page',
  templateUrl: './link-footer.page.html',
  styleUrls: ['./link-footer.page.scss'],
})

export class LinkFooterPage implements OnInit {

  isLoading: boolean = false;
  LinkFooterKeys: LinkFooterKeys[];
  sectors: ISector[];
  filter: string;

  showCreatekeyword: boolean = false;

  linkfooter: any =[];
  linkfooter_filtered: any =[];
  locations: [];
  footers: [];

  keyLinkFooter: any =  {
    id: '',
    footer: '',
    sector_id: {
      id: '',
      name: '',
    },
    locations_id: {
      id: '',
      title: '',
    },
    footers_id: {
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
  
    await this.search();
  }

 

  search_filter(event?: any){
    this.linkfooter = this.linkfooter_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.linkfooter = this.linkfooter.filter((sector) => {
        return sector.link.toLowerCase().includes(this.filter.toLowerCase());
      })
    } else {
      this.linkfooter = this.linkfooter_filtered;
    }
  } 


  async search(event?: any) {
    this.isLoading = true;
    const {response} = await this.keywordService.getLinkFooterKeywords();
    this.linkfooter = response;
    this.linkfooter_filtered = this.linkfooter;

    this.isLoading = false;
  }

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedString;
  }


 
  async create(title: string,  link: string, pagetitle: string, h1: string, h2: string, description: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (link && title && pagetitle && h1 && h2 && description) {
      try {


        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        

        await this.keywordService.addLinkFooterKeyword({title,  link: linkParse, pagetitle, h1, h2, description});
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
  async showEdit(keys: LinkFooterKeys) {

    this.keyLinkFooter = JSON.parse(JSON.stringify(keys));

    let searchText;
    searchText = this.keyLinkFooter.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keyLinkFooter.link = searchText;
    this.showCreatekeyword = true;

  }

  restoreData(){
    this.keyLinkFooter =  {
      id: '',
      footer: '',
      sector_id: {
        id: '',
        name: '',
      },
      locations_id: {
        id: '',
        name: '',
      },
      footers_id: {
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
  async edit( title: string,  link: string ,pagetitle: string, h1: string, h2: string, description: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (title && link && pagetitle && h1 && h2 && description ) {
      try {
        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)
        
        await this.keywordService.updateLinkFooterKeyword({footer:  parseInt(this.keyLinkFooter.id) ,title,  link: linkParse, pagetitle, h1, h2, description});
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

  async delete(keys: LinkFooterKeys) {
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

      await this.keywordService.removeLinkFooterKeyword(keys.id);

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
