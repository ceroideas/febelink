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
  link: string,
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
    link: '',
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

    this.sectorKeys.forEach((sector: any) => { 
      if ( sector.keySearch !== null && sector.keySearch !== undefined && sector.keySearch.length > 0){
        const namesString = sector.keySearch.map(item => item.key_name).join(', '); // Usa

        sector.keySearchParse = namesString;

        sector.keySearch.forEach((key) => {
          key.edit = false;
          key.delete = false;
          key.name = key.key_name;
        })
      }
    })

    this.sectorKeys_filtered = this.sectorKeys;
    this.isLoading = false;

  }

  search_filter(event?: any){
    this.sectorKeys = this.sectorKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.sectorKeys = this.sectorKeys.filter((sector) => {
        if ( sector?.link !== '' && sector?.link !== undefined && sector?.link !== null){
          return sector?.link?.toLowerCase().includes(this.filter.toLowerCase());
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
        
        let keySearch = []
        keySearch =  this.readInputValues()
        
        await this.keywordService.addSectorKeyword({name: sector, link: keyword, keySearch, icon: icon});
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

        await this.keywordService.updateSectorKeyword({sector:this.keySector.id,  name: sector, link: keywordParse, icon:  icon});

        this.keySector.keySearch.forEach(async (key) => {
          console.log(key)
          if ( key.edit ){
            await this.keywordService.updateSectorKeySearch({id:key.id,  name: key.name});
          }
         
          if ( key.delete ){
            await this.keywordService.removeSectorKeySearch(key.id);
          }
        })


        const inputs = document.querySelectorAll('.nuevo') as NodeListOf<HTMLInputElement>;
        inputs.forEach(async (input) => {
          await this.keywordService.updateSectorKeySearch({sector:this.keySector.id,  name: input.value});
        })

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

  readInputValues() {
    const inputs = document.querySelectorAll('.input-with-icon') as NodeListOf<HTMLInputElement>;
    let keySearch = [];
    inputs.forEach((input) => {
      keySearch.push({name: input.value});
    })
     return keySearch;
  }
  async showEdit(keys: SectorKeys) {

    this.keySector = {};
    this.keySector = JSON.parse(JSON.stringify(keys));
    let searchText;
    searchText = this.keySector.link.replace(new RegExp('-', 'g'), ' ').toLowerCase();
    searchText= this.removeAccents(searchText)

    this.keySector.link = searchText;

    //

    this.showCreatekeyword = true;
    setTimeout(() => {
      this.addInputValue(this.keySector.keySearch)
    }, 100);
    
  }

  restoreData(){
    this.keySector =  {
      sector: '',
      nombre: '',
      link: '',
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

  showCreate(){
    this.showCreatekeyword = true; 
    setTimeout(() => {
      this.addInput()
    }, 200);
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
        // const target = e.target as HTMLInputElement;
        // this.keySector.keySearch.push({key_name: target.value,  delete: false, edit: true});

        input.className += ' nuevo';
      }
    

      //container.removeChild(inputIconContainer);
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
