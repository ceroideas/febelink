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
  id_sector: {
    id: number,
    name: string,
  },
  key_name: string,
  sector: number,
  nombre: string,
  link: string,
  imagURL: string,
  h1:string,
  pagetitle:string,
  metadescription:string,
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
  subSectorKeys_filtered: SubSectorKeys[];
  sectors: ISubSector[];
  subSectors: ISector[];
  filter: string;

  showCreatekeyword: boolean = false;

  keySubSector: any =  {
    id: '',
    subsector: '',
    id_sector: {
      id: '',
      name: '',
    },
    sector: '',
    nombre: '',
    link: '',
    h1: '',
    pagetitle: '',
    metadescription: '',
    imageURL: '',
  }
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private subSectorService: SubsectorService,
    private sectorService: SubsectorService
  ) {
  }
  async ngOnInit() {
    const {response} = await this.keywordService.getSectorKeywords();
    this.sectors = response;
    await this.search();
  }

  search_filter(event?: any){
    this.subSectorKeys = this.subSectorKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.subSectorKeys = this.subSectorKeys.filter((sector) => {
        if ( sector?.link !== '' && sector?.link !== undefined && sector?.link !== null){
          return sector?.link?.toLowerCase().includes(this.filter.toLowerCase());
        }
      })
    } else {
      this.subSectorKeys = this.subSectorKeys_filtered;
    }
  }

  

  async search(event?: any) {
    this.isLoading = true;
    // this.filter = event?.target?.value || this.filter || '';
    const {response} = await this.keywordService.getSubSectorAll();
    this.subSectorKeys = response;
    this.subSectorKeys.forEach((subsector: any) => { 
      console.log(subsector)
      if ( subsector.keySearch !== null && subsector.keySearch !== undefined && subsector.keySearch.length > 0){
        const namesString = subsector.keySearch.map(item => item.key_name).join(', '); // Usa
        subsector.keySearchParse = namesString;
        subsector.keySearch.forEach((key) => {
          key.edit = false;
          key.delete = false;
          key.name = key.key_name;
        })
      }
    })
    this.subSectorKeys_filtered = this.subSectorKeys;
   
    this.isLoading = false;
  }

  removeAccents(inputString) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    return normalizedString;
  }
  readInputValues() {
    const inputs = document.querySelectorAll('.input-with-icon') as NodeListOf<HTMLInputElement>;
    let keySearch = [];
    inputs.forEach((input) => {
      keySearch.push({name: input.value});
    })
     return keySearch;
  }
  async create(sector: string, name: string,  link: string, imageURL: string, h1: string,  pagetitle: string, metadescription: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && name  && link && h1 && pagetitle && metadescription) {
      try {

        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse);
        let keySearch = []
        keySearch =  this.readInputValues()
        await this.keywordService.addSubSectorKeyword({sector : parseInt(sector), name, link: linkParse, keySearch:keySearch,  imageURL, h1, pagetitle, metadescription});
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

  async edit(sector: string, name: string,  link: string, imageURL: string, h1: string,  pagetitle: string, metadescription: string) {

    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && name && link && h1 && pagetitle && metadescription) {
      try {

        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)

        await this.keywordService.updateSubSectorKeyword({ sector:  parseInt(sector), subsector:  this.keySubSector.id, name: name, link: linkParse, imageURL: imageURL, h1, pagetitle, metadescription});

        this.keySubSector.keySearch.forEach(async (key) => {
          if ( key.edit ){
            await this.keywordService.updateSubSectorKeySearch({id:key.id,  name: key.name});
          }
         
          if ( key.delete ){
            await this.keywordService.removeSubSectorKeySearch(key.id);
          }
        })


        const inputs = document.querySelectorAll('.nuevo') as NodeListOf<HTMLInputElement>;
        inputs.forEach(async (input) => {
          await this.keywordService.updateSubSectorKeySearch({subSector:this.keySubSector.id,  name: input.value});
        })

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
 
  async delete(keys: SubSectorKeys) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    }

    try {
      if (!await this.alertSvc.confirm({
        title: 'Eliminar ',
        msg: `¿Confirma que desea eliminar el subsector: '${keys.nombre}' ?`
      })) {
        return; // Cancel button
      }

      this.isLoading = true;
      await this.loadingSvc.show();

      await this.keywordService.removeSubSectorKeyword(keys.id);

      await this.toastSvc.show(`El Subsector'${keys.key_name}' ha sido eliminada con éxito.`, true);
      await this.loadingSvc.dismiss();

      await this.search();
    } catch (e) {
      this.isLoading = false;
      await this.loadingSvc.dismiss();
      await this.toastSvc.show('admin.tokensUsers.delete.error', true);
    }
  }

  async showEdit(keys: SubSectorKeys) {
  
    this.keySubSector = JSON.parse(JSON.stringify(keys));
    let searchText;
    searchText = this.keySubSector.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keySubSector.link = searchText;

    this.showCreatekeyword = true;
    setTimeout(() => {
      this.addInputValue(this.keySubSector.keySearch)
    }, 100);


  }

  restoreData(){
    this.keySubSector =  {
      id: '',
      subsector: '',
      id_sector: {
        id: '',
        name: '',
      },
      sector: '',
      nombre: '',
      link: '',
      imageURL: '',
    }
    this.showCreatekeyword = false;
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

  addInput() {
    const container = document.getElementById('inputContainer');

    // Crea el contenedor del input y el ícono
    const inputIconContainer = document.createElement('div');
    inputIconContainer.className = 'input-icon-container';

    // Crea el input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input-with-icon';

    // Crea el ícono de búsqueda
    const icon = document.createElement('i');
    icon.className = 'fas fa-times iconinput';

    icon.onclick = () =>{
        container.removeChild(inputIconContainer);
        if (container.children.length === 0) {
         this.addInput()
        }
    };
    input.onkeyup = (e: any) => {
      if (this.showCreatekeyword) {
        input.className += ' nuevo';
      }

    };
   
    // Añade el input, el ícono y el botón de eliminar al contenedor
    inputIconContainer.appendChild(input);
    inputIconContainer.appendChild(icon);



    // Añade el contenedor al elemento en el DOM
    container.appendChild(inputIconContainer);

    // input.focus();
  }

  addInputValue(keySearch: any) {
    
    keySearch.forEach((key) => {
      const container = document.getElementById('inputContainer');
     
  
    // Crea el contenedor del input y el ícono
    const inputIconContainer = document.createElement('div');
    inputIconContainer.className = 'input-icon-container';

    // Crea el input
    const input = document.createElement('input');
    input.type = 'text';
    input.value =  key.key_name;
    input.className = 'input-with-icon';

    // Crea el ícono de búsqueda
    const icon = document.createElement('i');
    icon.className = 'fas fa-times iconinput';

    icon.onclick = () => {
      key.delete = true;
      key.edit = false;
      container.removeChild(inputIconContainer);
    };

    input.onkeyup = (e: any) => {
      const target = e.target as HTMLInputElement;
      key.edit = true;
      key.delete = false;
      key.name = target.value;
      //container.removeChild(inputIconContainer);
    };

    // Añade el input, el ícono y el botón de eliminar al contenedor
    inputIconContainer.appendChild(input);
    inputIconContainer.appendChild(icon);


    // // Añade el contenedor al elemento en el DOM
    container.appendChild(inputIconContainer);
    });

    // input.focus();
  }

}
