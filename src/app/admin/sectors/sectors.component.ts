import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { Sector as LegacySector, KeySearch as LegacyKeySearch } from '../../interfaces/sector';
import { Subsector } from '../../interfaces/subsector';

interface KeySearch extends LegacyKeySearch {
  removed?: boolean;
}
interface Sector extends LegacySector {
  keySearch: KeySearch[];
  selected?: boolean;
  iconError?: boolean;
  isNew?: boolean;
  keyWords?: string;
}

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html'
})
export class SectorsComponent extends BaseComponent implements OnInit {

  @ViewChild('keywordsModal') keywordsModal: any;
  @ViewChild('subsectorsModal') subsectorsModal: any;

  sectors: Sector[] = [];
  filteredSectors: Sector[] = [];
  importedSectors: Sector[] = [];
  importedNewSectors: Sector[] = [];
  importedModifiedSectors: Sector[] = [];
  importedDeletedSectors: Sector[] = [];
  keywordsCount: number = 0;

  currentSector: Sector | undefined = undefined;

  querySector: string | undefined = undefined;

  get someSelected(): boolean {
    return this.filteredSectors.some(item => item.selected);
  }

  get selected(): Sector[] {
    return this.filteredSectors.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentSector?.isNew && !!this.currentSector?.nombre && !!this.currentSector?.icon && !!this.currentSector?.keyWords;
  }

  get canUpdate(): boolean {
    return !this.currentSector?.isNew && !!this.currentSector?.nombre && !!this.currentSector?.icon;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef
  ) { 
    super();

    this.route.queryParams.subscribe(params => {
      this.querySector = params['sector'];
    });
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.keywordService.getSectorKeywords()
    .then((data: any) => {
      this.sectors = data.response;
      this.filter({ target: { value: this.currentFilter } });
      this.keywordsCount = this.sectors.map(item => item.keySearch).flat().length;

      this.getSubsectors().then(data2 => {
        this.sectors.forEach(sector => {
          sector.subSectors = data2.response.filter((subsector: Subsector) => subsector.id_sector.id === sector.id);
        });
      });

      if ( this.querySector ) {
        this.currentSector = this.sectors.find(item => item.id === Number(this.querySector));
        this.showEditModal();
      }

      this.loading = false;
      this.cdRef.detectChanges();
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });
  }

  getSubsectors() {
    return this.keywordService.getSubSectorAll()
    .then((data: any) => {
      return data;
    })
    .catch((error) => {
      this.loading = false;
    });
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredSectors = this.sectors.filter(item => item.nombre.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentSector = {
      id: 0,
      nombre: '',
      link: '',
      icon: '',
      keySearch: [],
      subSectors: [],
      isNew: true,
      keyWords: ''
    };
    this.showCreateModal();
  }
  showKeywords(event: any, item: Sector) {
    event.stopPropagation();
    this.currentSector = item;
    this.keywordsModal.nativeElement.showModal();
  }
  showSubsectors(event: any, item: Sector) {
    event.stopPropagation();
    this.currentSector = item;
    this.subsectorsModal.nativeElement.showModal();
  }
  showEdit(event: any, item: Sector) {
    event.stopPropagation();
    this.currentSector = JSON.parse(JSON.stringify(item));
    this.showEditModal();
  }
  showDelete(event: any, item: Sector) {
    event.stopPropagation();
    this.currentSector = item;
    this.showDeleteModal();
  }

  viewLink(event: any, link: string) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree([`servicios/${link}/espana`], {}));
    window.open(url, '_blank');
  }

  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Nombre;Enlace;Icono;Palabras clave\n';

    // Add data
    const sectorsCsv = this.filteredSectors.map(item => {
      return `${item.nombre};${item.link};${item.icon};${item.keySearch.map(key => key.key_name).join(',')}`;
    })

    // Add data to csv
    csvContent += sectorsCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sectores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  import() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        lines.shift(); // Remove header
        const sectors = lines.map((line: string) => {
          const [name, link, icon, keySearch] = line.split(';');
          return { name, link, icon, keySearch };
        });

        // Parse data
        this.importedSectors = sectors.map((sector: { name: string, link: string, icon: string, keySearch: string }) => {
          return {
            nombre: sector.name,
            link: sector.link,
            icon: sector.icon,
            keySearch: sector.keySearch.split(',').map((key: string) => {
              return { key_name: key };
            })
          }
        })

        // Check for new sectors
        this.importedNewSectors = this.importedSectors.filter((sector: Sector) => 
          !this.sectors.find(item => item.nombre === sector.nombre)
        );

        // Check for modified sectors
        this.importedModifiedSectors = this.importedSectors
        .filter((sector: Sector) => 
          !!this.sectors.find(item => item.nombre === sector.nombre)
        )
        .filter((sector: Sector) => {
          // Check if sector has been modified
          const currentSector = this.sectors.find(item => item.nombre === sector.nombre);
          return currentSector!.link !== sector.link || 
                 currentSector!.icon !== sector.icon || 
                 currentSector!.keySearch.map(key => key.key_name).join(',') !== sector.keySearch.map(key => key.key_name).join(',');
        });

        // Check for deleted sectors
        this.importedDeletedSectors = this.sectors.filter((sector: Sector) => 
          !this.importedSectors.find(item => item.nombre === sector.nombre)
        );

        this.importSummaryModal.nativeElement.showModal();
      }
      reader.readAsText(file);
    }
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  async create() {
    this.loadingRequest = true;

    const keySearch = this.currentSector?.keyWords?.split(',').map((key: string) => {
      return { name: key };
    })

    try {
      await this.keywordService.addSectorKeyword({
        name: this.currentSector!.nombre, 
        link: this.currentSector!.link || this.generateLink(this.currentSector!.nombre),
        keySearch: keySearch, 
        icon: this.currentSector!.icon || ''
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentSector = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.keywordService.removeSectorKeyword(this.currentSector?.id);

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentSector = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let sector of this.selected ) {
        await this.keywordService.removeSectorKeyword(sector.id);
      }

      this.getData(true);

      this.loadingRequest = false;
      this.multipleDeleteModal.nativeElement.close();
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async update() {
    this.loadingRequest = true;

    const keySearch = this.currentSector?.keyWords?.split(',').map((key: string) => {
      return { name: key };
    })

    try {
      // Update sector
      await this.keywordService.updateSectorKeyword({
        sector: this.currentSector!.id,
        name: this.currentSector!.nombre, 
        link: this.currentSector!.link || this.generateLink(this.currentSector!.nombre),
        icon: this.currentSector!.icon
      });

      // Update deleted key search
      for(let key of this.currentSector!.keySearch.filter(key => key.removed)) {
        await this.keywordService.removeSectorKeySearch(key.id);
      }

      // Update new key search
      if ( keySearch ) {
        for(let key of keySearch) {
          await this.keywordService.updateSectorKeySearch({sector: this.currentSector!.id, name: key.name});
        }
      }

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentSector = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new sectors
    for(let sector of this.importedNewSectors) {
      await this.keywordService.addSectorKeyword({
        name: sector.nombre, 
        link: sector.link || this.generateLink(sector.nombre),
        keySearch: sector.keySearch.map(key => { return { name: key.key_name } }), 
        icon: sector.icon || '-'
      });
    };

    // Update modified sectors
    for(let sector of this.importedModifiedSectors) {
      await this.keywordService.updateSectorKeyword({
        sector: this.sectors.find(item => item.nombre === sector.nombre)!.id,
        name: sector.nombre, 
        link: sector.link || this.generateLink(sector.nombre),
        icon: sector.icon || '-'
      });

      // Get new key search
      const newKeys = sector.keySearch.filter(key => !this.sectors.find(item => item.nombre === sector.nombre)!.keySearch.map(key => key.key_name).includes(key.key_name));
      // Get deleted key search
      const deletedKeys = this.sectors.find(item => item.nombre === sector.nombre)!.keySearch.filter(key => !sector.keySearch.map(key => key.key_name).includes(key.key_name));

      for(let key of newKeys) {
        await this.keywordService.updateSectorKeySearch({sector: this.sectors.find(item => item.nombre === sector.nombre)!.id, name: key.key_name});
      }

      for(let key of deletedKeys) {
        await this.keywordService.removeSectorKeySearch(key.id);
      }
    };

    // Delete deleted sectors
    for(let sector of this.importedDeletedSectors) {
      await this.keywordService.removeSectorKeyword(sector.id);
    };

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }
}
