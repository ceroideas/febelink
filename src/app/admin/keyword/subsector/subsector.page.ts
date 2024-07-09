import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertSvc} from '../../../services/alert.service';
import {LoadingSvc} from '../../../services/loading.service';
import {ToastSvc} from '../../../services/toast.service';
import {KeywordService} from '../services/keyword.service';
import {SectorService} from '../../../components/sectors/services/sectores.service';
import {ISector, ISubSector} from '../../../models/sector.model';
import {SubsectorService} from '../../../components/sectors/services/subsectores.service';
import { Location } from '@angular/common'

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
  isEdit: boolean,
  keySearchParse: string,
  page_title: string
  imageURL: string,
  meta_description: string,
}
@Component({
  selector: 'sub-sector-page',
  templateUrl: './subsector.page.html',
  styleUrls: ['./subsector.page.scss'],
  host: {ngSkipHydration: 'true'},
})

export class SubSectorPage implements OnInit {

  isLoading: boolean = false;
  subSectorKeys: SubSectorKeys[] | undefined
  subSectorKeys_filtered: SubSectorKeys[] | undefined
  sectors: ISubSector[] | undefined
  subSectors: ISector[] | undefined
  filter: string | undefined

  showCreatekeyword: boolean = false;
  objectSelected:  any | undefined
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
    private location: Location,
    private cdref: ChangeDetectorRef

  ) {
  }
  async ngOnInit() {
    this.keywordService.getSectorKeywords().then(async (response: any) => {
      this.sectors =  response.response;
      await this.search();
    })

  
  }
  /**
   * Close modal
   */
  public goBack(): void {
    this.location.back();
  }

  search_filter(event?: any){
    this.subSectorKeys = this.subSectorKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      if (this.subSectorKeys)
      this.subSectorKeys = this.subSectorKeys.filter((sector:any) => {
        if ( sector?.link !== '' && sector?.link !== undefined && sector?.link !== null){
          if (this.filter)
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
    this.keywordService.getSubSectorAll().then(async (response: any) => {

        this.subSectorKeys = response.response;
        if ( this.subSectorKeys)
        this.subSectorKeys.forEach((subsector: any) => { 
          if ( subsector.keySearch !== null && subsector.keySearch !== undefined && subsector.keySearch.length > 0){
            const namesString = subsector.keySearch.map((item: any) => item.key_name).join(', '); // Usa
            subsector.keySearchParse = namesString;
            subsector.keySearch.forEach((key: any) => {
              key.edit = false;
              key.delete = false;
              key.name = key.name;
            })
          }
        })

        if ( this.objectSelected !== undefined){
          let filterKey = this.subSectorKeys?.filter((sector:any) => sector.id === this.objectSelected?.id)[0];
          this.objectSelected = filterKey;
          if (filterKey !== undefined){
            filterKey.link =  this.objectSelected.link
            filterKey.nombre =  this.objectSelected.nombre
          }
          
          this.cdref.detectChanges()
        }
        this.subSectorKeys_filtered = this.subSectorKeys;
      
        this.isLoading = false;
      })
  }

  removeAccents(inputString: any) {
    // Normalize accented characters to their base form
    const normalizedString = inputString.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    return normalizedString;
  }
  readInputValues() {
    const inputs = document.querySelectorAll('.input-with-icon') as NodeListOf<HTMLInputElement>;
    let keySearch: any = [];
    inputs.forEach((input) => {
      keySearch.push({name: input.value});
    })
     return keySearch;
  }
  async create(sector: string, name: string,  link: string, imageURL: string, h1: string,  pagetitle: string, metadescription: string) {
    if (this.isLoading) {
      this.showToastLoading();
      return;
    } else if (sector && name  ) {
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
    } else if (sector && name ) {
      try {

        let linkParse;
        linkParse = link.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        linkParse= this.removeAccents(linkParse)

        await this.keywordService.updateSubSectorKeyword({ sector:  parseInt(sector), subsector:  this.keySubSector.id, name: name, link: linkParse, imageURL: imageURL, h1, pagetitle, metadescription});

        this.keySubSector.keySearch.forEach(async (key:any) => {
          if ( key.edit === true ){
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

        setTimeout(() => {
          this.search();
          this.restoreData();

          this.cdref.detectChanges()
        }, 10);
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
  
    this.objectSelected = keys;
    this.keySubSector = {};
    this.keySubSector = keys;
    // this.keySubSector = JS ON.parse(JSON.stringify(keys));
    let searchText;
    if ( this.keySubSector.link !== '' &&this.keySubSector.link !==  null && this.keySubSector.link !== undefined){
      searchText = this.keySubSector.link?.replace(new RegExp('-', 'g'), ' ').toLowerCase();
      searchText= this.removeAccents(searchText)
    }
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
        container?.removeChild(inputIconContainer);
        if (container?.children.length === 0) {
         this.addInput()
        }
    };
    input.onkeyup = (e: any) => {
      if (this.showCreatekeyword) {
        // const target = e.target as HTMLInputElement;
        // this.keySector.keySearch.push({key_name: target.value,  delete: false, edit: true});

        input.className += ' nuevo';
      }
    

      //container?.removeChild(inputIconContainer);
    };
   
    // Añade el input, el ícono y el botón de eliminar al contenedor
    inputIconContainer?.appendChild(input);
    inputIconContainer?.appendChild(icon);



    // Añade el contenedor al elemento en el DOM
    container?.appendChild(inputIconContainer);

    // input.focus();
  }

  addInputValue(keySearch: any) {
    
    keySearch.forEach((key: any) => {
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
      container?.removeChild(inputIconContainer);
    };

    input.onkeyup = (e: any) => {
      const target = e.target as HTMLInputElement;
      key.edit = true;
      key.delete = false;
      key.name = target.value;

      //container?.removeChild(inputIconContainer);
    };

    // Añade el input, el ícono y el botón de eliminar al contenedor
    inputIconContainer?.appendChild(input);
    inputIconContainer?.appendChild(icon);


    // // Añade el contenedor al elemento en el DOM
    container?.appendChild(inputIconContainer);
    });

    // input.focus();
  }

}
