import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { Subsector as LegacySubsector } from '../../interfaces/subsector';
import { Sector, KeySearch as LegacyKeySearch } from '../../interfaces/sector';

interface KeySearch extends LegacyKeySearch {
  removed?: boolean;
}
interface Subsector extends LegacySubsector {
  keySearch: KeySearch[];
  selected?: boolean;
  iconError?: boolean;
  isNew?: boolean;
  keyWords?: string;
}

@Component({
  selector: 'app-subsectors',
  templateUrl: './subsectors.component.html'
})
export class SubsectorsComponent extends BaseComponent implements OnInit {

  @ViewChild('keywordsModal') keywordsModal: any;

  sectors: Sector[] = [];
  subsectors: Subsector[] = [];
  filteredSubsectors: Subsector[] = [];
  importedSubsectors: Subsector[] = [];
  importedNewSubsectors: Subsector[] = [];
  importedModifiedSubsectors: Subsector[] = [];
  importedDeletedSubsectors: Subsector[] = [];
  keywordsCount: number = 0;
  visibleOnHome: number = 0;

  currentSubsector: Subsector | undefined = undefined;

  get someSelected(): boolean {
    return this.filteredSubsectors.some(item => item.selected);
  }

  get selected(): Subsector[] {
    return this.filteredSubsectors.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentSubsector?.isNew && !!this.currentSubsector?.id_sector  && 
      !!this.currentSubsector?.id_sector.id && !!this.currentSubsector?.nombre &&
      (
        !this.currentSubsector?.employment?.status ||
        (!!this.currentSubsector?.employment?.status && !!this.currentSubsector?.employment?.title)
      );
  }

  get canUpdate(): boolean {
    return !this.currentSubsector?.isNew && !!this.currentSubsector?.id_sector  && 
      !!this.currentSubsector?.id_sector.id && !!this.currentSubsector?.nombre &&
      (
        !this.currentSubsector?.employment?.status ||
        (!!this.currentSubsector?.employment?.status && !!this.currentSubsector?.employment?.title)
      )
  }

  constructor(
    private router: Router,
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.keywordService.getSubSectorAll()
    .then((data: any) => {
      this.subsectors = data.response;
      this.filter({ target: { value: this.currentFilter } });
      this.keywordsCount = this.subsectors.map(item => item.keySearch).flat().length;
      this.visibleOnHome = this.subsectors.filter(item => item.imageURL).length

      this.loading = false;
      this.cdRef.detectChanges();
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });

    this.keywordService.getSectorKeywords()
    .then((data: any) => {
      this.sectors = data.response;
      this.cdRef.detectChanges();
    });
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredSubsectors = this.subsectors.filter(item => item.nombre.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentSubsector = {
      id: 0,
      h1: '',
      id_sector: { id: 0, name: '' },
      imageURL: '',
      keySearch: [],
      link: '',
      meta_description: '',
      nombre: '',
      page_title: '',
      hidden: false,
      checked: false,
      isNew: true,
      keyWords: '',
      employment: {
        id: 0,
        id_sub_sector: 0,
        imageURL: '',
        link: '',
        updated_at: '',
        status: false,
        title: '',
        h1: '',
        page_title: '',
        meta_description: ''
      }
    };
    this.showCreateModal();
  }
  showKeywords(event: any, item: Subsector) {
    event.stopPropagation();
    this.currentSubsector = item;
    this.keywordsModal.nativeElement.showModal();
  }
  showEdit(event: any, item: Subsector) {
    event.stopPropagation();
    this.currentSubsector = JSON.parse(JSON.stringify(item));
    this.currentSubsector?.employment && (this.currentSubsector!.employment.status = !!this.currentSubsector!.employment.title);
    !this.currentSubsector?.id_sector?.id && (this.currentSubsector!.id_sector = { id: 0, name: '' });
    this.showEditModal();
  }
  showDelete(event: any, item: Subsector) {
    event.stopPropagation();
    this.currentSubsector = item;
    this.showDeleteModal();
  }
  viewSector(event: any, item: Subsector) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree(['admin/sectors'], { queryParams: { sector: item.id_sector.id } }));
    window.open(url, '_blank');
  }
  viewLink(event: any, link: string) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree([`listado/${link}`], {}));
    window.open(url, '_blank');
  }

  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Sector;Nombre;Enlace;H1;Icono;Meta descripción;Título de página;Palabras clave;Nombre empleo;Link empleo;H1 empleo;Titulo de página empleo;Meta descripción empleo\n';

    // Add data
    const subsectorsCsv = this.filteredSubsectors.map(item => {
      return `${item.id_sector?.name || ''};${item.nombre || ''};${item.link || ''};${item.h1 || ''};${item.imageURL || ''};${item.meta_description || ''};${item.page_title || ''};${item.keySearch.map(key => key.key_name).join(',') || ''};${item.employment?.title || ''};${item.employment?.link || ''};${item.employment?.h1 || ''};${item.employment?.page_title || ''};${item.employment?.meta_description || ''}`;
    })

    // Add data to csv
    csvContent += subsectorsCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "profesiones.csv");
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
        const subsectors = lines.map((line: string) => {
          const [sector, name, link, h1, icon, meta_description, page_title, keySearch, nameEmployment, linkEmployment, h1Employment, pagetitleEmployment, metadescriptionEmployment] = line.split(';');
          return { sector, name, link, h1, icon, meta_description, page_title, keySearch, nameEmployment, linkEmployment, h1Employment, pagetitleEmployment, metadescriptionEmployment };
        });

        // Parse data
        this.importedSubsectors = subsectors.map((subsector: { 
          sector: string, 
          name: string, 
          link: string, 
          h1: string, 
          icon: string, 
          meta_description: string, 
          page_title: string, 
          keySearch: string,
          nameEmployment: string,
          linkEmployment: string,
          h1Employment: string,
          pagetitleEmployment: string,
          metadescriptionEmployment: string
        }) => {
          return {
            id: 0,
            h1: subsector.h1,
            id_sector: { id: 0, name: subsector.sector },
            imageURL: subsector.icon,
            keySearch: subsector.keySearch.split(',').map((key: string) => ({ key_name: key })),
            link: subsector.link,
            meta_description: subsector.meta_description,
            nombre: subsector.name,
            page_title: subsector.page_title,
            employment: {
              status: !!subsector.nameEmployment,
              title: subsector.nameEmployment,
              link: subsector.linkEmployment,
              h1: subsector.h1Employment,
              page_title: subsector.pagetitleEmployment,
              meta_description: subsector.metadescriptionEmployment
            }
          };
        });

        // Check for new sectors
        this.importedNewSubsectors = this.importedSubsectors.filter((subsector: Subsector) => 
          !this.subsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name)
        );

        // Check for modified sectors
        this.importedModifiedSubsectors = this.importedSubsectors
        .filter((subsector: Subsector) => 
          !!this.subsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name)
        )
        .filter((subsector: Subsector) => {
          // Check if sector has been modified
          const currentSubsector = this.subsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name);
          return this.normalizeStringToCompare(currentSubsector!.link) !== this.normalizeStringToCompare(subsector.link) || 
                 this.normalizeStringToCompare(currentSubsector!.id_sector.name) !== this.normalizeStringToCompare(subsector.id_sector.name) || 
                 this.normalizeStringToCompare(currentSubsector!.imageURL) !== this.normalizeStringToCompare(subsector.imageURL) || 
                 this.normalizeStringToCompare(currentSubsector!.h1) !== this.normalizeStringToCompare(subsector.h1) ||
                 this.normalizeStringToCompare(currentSubsector!.meta_description) !== this.normalizeStringToCompare(subsector.meta_description) ||
                 this.normalizeStringToCompare(currentSubsector!.page_title) !== this.normalizeStringToCompare(subsector.page_title) ||
                 currentSubsector!.keySearch.map(key => key.key_name).join(',') !== subsector.keySearch.map(key => key.key_name).join(',') ||
                 this.normalizeStringToCompare(currentSubsector!.employment?.title) !== this.normalizeStringToCompare(subsector.employment?.title) ||
                 this.normalizeStringToCompare(currentSubsector!.employment?.link) !== this.normalizeStringToCompare(subsector.employment?.link) ||
                 this.normalizeStringToCompare(currentSubsector!.employment?.h1) !== this.normalizeStringToCompare(subsector.employment?.h1) ||
                 this.normalizeStringToCompare(currentSubsector!.employment?.page_title) !== this.normalizeStringToCompare(subsector.employment?.page_title) ||
                 this.normalizeStringToCompare(currentSubsector!.employment?.meta_description) !== this.normalizeStringToCompare(subsector.employment?.meta_description);
        });

        // Check for deleted sectors
        this.importedDeletedSubsectors = this.subsectors.filter((subsector: Subsector) => 
          !this.importedSubsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name)
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

    const keySearch = this.currentSubsector?.keyWords?.length ? this.currentSubsector?.keyWords?.split(',').map((key: string) => {
      return { name: key };
    }) : [];

    try {
      await this.keywordService.addSubSectorKeyword({
        sector: this.currentSubsector!.id_sector!.id, 
        name: this.currentSubsector!.nombre, 
        link: this.currentSubsector?.link || this.generateLink(this.currentSubsector!.nombre, '', 'en-españa'), 
        keySearch: keySearch || [],  
        imageURL: this.currentSubsector?.imageURL || '', 
        h1: this.currentSubsector?.h1 || this.generateH1(this.currentSubsector!.nombre), 
        pagetitle: this.currentSubsector?.page_title || this.generatePageTitle(this.currentSubsector!.nombre), 
        metadescription: this.currentSubsector?.meta_description || this.generateMetaDescription(this.currentSubsector!.nombre)
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentSubsector = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.keywordService.removeSubSectorKeyword(this.currentSubsector!.id);

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentSubsector = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let subsector of this.selected ) {
        await this.keywordService.removeSubSectorKeyword(subsector.id);
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

    const keySearch = this.currentSubsector?.keyWords?.length ? this.currentSubsector?.keyWords?.split(',').map((key: string) => {
      return { name: key };
    }) : [];

    try {
      // Update subsector
      await this.keywordService.updateSubSectorKeyword({
        sector: this.currentSubsector!.id_sector!.id, 
        subsector: this.currentSubsector!.id,
        name: this.currentSubsector!.nombre, 
        link: this.currentSubsector?.link || this.generateLink(this.currentSubsector!.nombre, '', 'en-españa'), 
        imageURL: this.currentSubsector?.imageURL || '', 
        h1: this.currentSubsector?.h1 || this.generateH1(this.currentSubsector!.nombre), 
        pagetitle: this.currentSubsector?.page_title || this.generatePageTitle(this.currentSubsector!.nombre), 
        metadescription: this.currentSubsector?.meta_description || this.generateMetaDescription(this.currentSubsector!.nombre),
        nameEmployment: this.currentSubsector?.employment?.status ? this.currentSubsector?.employment?.title : undefined,
        linkEmployment: this.currentSubsector?.employment?.status ? this.currentSubsector?.employment?.link || this.generateLink(this.currentSubsector!.nombre, '', 'en-españa') : undefined,
        h1Employment: this.currentSubsector?.employment?.status ? this.currentSubsector?.employment?.h1 || this.generateH1(this.currentSubsector!.nombre) : undefined,
        pagetitleEmployment: this.currentSubsector?.employment?.status ? this.currentSubsector?.employment?.page_title || this.generatePageTitle(this.currentSubsector!.nombre) : undefined,
        metadescriptionEmployment: this.currentSubsector?.employment?.status ? this.currentSubsector?.employment?.meta_description || this.generateMetaDescription(this.currentSubsector!.nombre) : undefined
      });

      // Update deleted key search
      for(let key of this.currentSubsector!.keySearch.filter(key => key.removed)) {
        await this.keywordService.removeSubSectorKeySearch(key.id);
      }

      // Update new key search
      if ( keySearch ) {
        for(let key of keySearch) {
          await this.keywordService.updateSubSectorKeySearch({subSector: this.currentSubsector!.id, name: key.name});
        }
      }

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentSubsector = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new subsectors
    for (let subsector of this.importedNewSubsectors) {
      await this.keywordService.addSubSectorKeyword({
        sector: this.sectors.find(item => item.nombre === subsector.id_sector.name)!.id, 
        name: subsector.nombre, 
        link: subsector.link || this.generateLink(subsector.nombre, '', 'en-españa'), 
        keySearch: subsector.keySearch.map(key => { return { name: key.key_name } }), 
        imageURL: subsector.imageURL || '', 
        h1: subsector.h1 || this.generateH1(subsector.nombre), 
        pagetitle: subsector.page_title || this.generatePageTitle(subsector.nombre), 
        metadescription: subsector.meta_description || this.generateMetaDescription(subsector.nombre),
        nameEmployment: subsector.employment?.status ? subsector.employment?.title : undefined,
        linkEmployment: subsector.employment?.status ? subsector.employment?.link || this.generateLink(subsector.nombre, '', 'en-españa') : undefined,
        h1Employment: subsector.employment?.status ? subsector.employment?.h1 || this.generateH1(subsector.nombre) : undefined,
        pagetitleEmployment: subsector.employment?.status ? subsector.employment?.page_title || this.generatePageTitle(subsector.nombre) : undefined,
        metadescriptionEmployment: subsector.employment?.status ? subsector.employment?.meta_description || this.generateMetaDescription(subsector.nombre) : undefined
      });
    }

    // Update modified subsectors
    for (let subsector of this.importedModifiedSubsectors) {
      await this.keywordService.updateSubSectorKeyword({
        sector: this.sectors.find(item => item.nombre === subsector.id_sector.name)!.id, 
        subsector: this.subsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name)!.id,
        name: subsector.nombre, 
        link: subsector.link || this.generateLink(subsector.nombre, '', 'en-españa'), 
        imageURL: subsector.imageURL || '', 
        h1: subsector.h1 || this.generateH1(subsector.nombre), 
        pagetitle: subsector.page_title || this.generatePageTitle(subsector.nombre), 
        metadescription: subsector.meta_description || this.generateMetaDescription(subsector.nombre),
        nameEmployment: subsector.employment?.status ? subsector.employment?.title : undefined,
        linkEmployment: subsector.employment?.status ? subsector.employment?.link || this.generateLink(subsector.nombre, '', 'en-españa') : undefined,
        h1Employment: subsector.employment?.status ? subsector.employment?.h1 || this.generateH1(subsector.nombre) : undefined,
        pagetitleEmployment: subsector.employment?.status ? subsector.employment?.page_title || this.generatePageTitle(subsector.nombre) : undefined,
        metadescriptionEmployment: subsector.employment?.status ? subsector.employment?.meta_description || this.generateMetaDescription(subsector.nombre) : undefined
      });

      // Get new key search
      const newKeys = subsector.keySearch.filter(key => !this.subsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name)!.keySearch.map(key => key.key_name).includes(key.key_name));
      // Get deleted key search
      const deletedKeys = this.subsectors.find(item => item.nombre === subsector.nombre && item.id_sector.name === subsector.id_sector.name)!.keySearch.filter(key => !subsector.keySearch.map(key => key.key_name).includes(key.key_name));

      for (let key of newKeys) {
        await this.keywordService.updateSubSectorKeySearch({subSector: this.subsectors.find(item => item.nombre === subsector.nombre)!.id, name: key.key_name});
      }

      for (let key of deletedKeys) {
        await this.keywordService.removeSubSectorKeySearch(key.id);
      }
    }

    // Delete deleted subsectors
    for (let subsector of this.importedDeletedSubsectors) {
      await this.keywordService.removeSubSectorKeyword(subsector.id);
    }

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }

  generateH1(string: string | undefined): string {
    if (!string) return '';
    return `${string} en España`;
  }
  generatePageTitle(string: string | undefined): string {
    if (!string) return '';
    return `${string} España en Febelink`;
  }
  generateMetaDescription(string: string | undefined): string {
    if (!string) return '';
    return `Servicios de ${string} en España. Todas las especialidades, derecho civil, laboral, mercantil, divorcios, herencias, tributario, de seguros`;
  }
}
