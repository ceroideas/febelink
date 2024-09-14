import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { City as LegacyCity } from '../../interfaces/city';
import { Location } from '../../interfaces/location';
import { LinkCity } from '../../interfaces/link-city';

interface City extends LegacyCity {
  selected?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html'
})
export class CitiesComponent extends BaseComponent implements OnInit {

  generatedLinks: LinkCity[] = [];
  provinces: Location[] = [];
  cities: City[] = [];
  filteredCities: City[] = [];
  importedCities: City[] = [];
  importedNewCities: City[] = [];
  importedModifiedCities: City[] = [];
  importedDeletedCities: City[] = [];

  currentCity: City | undefined = undefined;

  loadingLinks: boolean = false;

  get someSelected(): boolean {
    return this.filteredCities.some(item => item.selected);
  }

  get selected(): City[] {
    return this.filteredCities.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentCity?.isNew && !!this.currentCity?.title && !!this.currentCity?.locations_id?.id;
  }

  get canUpdate(): boolean {
    return !this.currentCity?.isNew && !!this.currentCity?.title && !!this.currentCity?.locations_id?.id;
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

    this.keywordService.getCityKeywords()
    .then((data: any) => {
      this.cities = data.response;
      this.filter({ target: { value: this.currentFilter } });

      this.loading = false;
      this.cdRef.detectChanges();
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });

    this.keywordService.getLocationKeywords()
    .then((data: any) => {
      this.provinces = data.response;
      this.cdRef.detectChanges();
    })

    this.loadingLinks = true;
    this.keywordService.getLinkCityKeywords()
    .then((data: any) => {
      this.generatedLinks = data.response;
      this.loadingLinks = false;
      this.cdRef.detectChanges();
    })
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredCities = this.cities.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentCity = {
      id: 0,
      h1: '',
      link: '',
      meta_description: '',
      page_title: '',
      title: '',
      locations_id: { id: 0, title: '' },
      updated_at: '',
      checked: false,
      isNew: true,
    };
    this.showCreateModal();
  }
  showEdit(event: any, item: City) {
    event.stopPropagation();
    this.currentCity = JSON.parse(JSON.stringify(item));
    this.showEditModal();
  }
  showDelete(event: any, item: City) {
    event.stopPropagation();
    this.currentCity = item;
    this.showDeleteModal();
  }
  viewProvince(event: any, item: City) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree(['admin/provinces'], { queryParams: { province: item.locations_id.id } }));
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
    csvContent += 'Ciudad;Provincia;Enlace;H1;Meta descripción;Título de página\n';

    // Add data
    const sectorsCsv = this.filteredCities.map(item => {
      return `${item.title};${item.locations_id.title};${item.link};${item.h1};${item.meta_description};${item.page_title}`;
    })

    // Add data to csv
    csvContent += sectorsCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ciudades.csv");
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
          const [title, province, link, h1, meta_description, page_title] = line.split(';');
          return { title, province, link, h1, meta_description, page_title };
        });

        // Parse data
        this.importedCities = sectors.map((city: { title: string, province: string, link: string, h1: string, meta_description: string, page_title: string }) => {
          return {
            title: city.title,
            link: city.link,
            h1: city.h1,
            meta_description: city.meta_description,
            page_title: city.page_title,
            locations_id: { title: city.province }
          }
        })

        // Check for new cities
        this.importedNewCities = this.importedCities.filter((city: City) => 
          !this.cities.find(item => item.title === city.title && item.locations_id.title === city.locations_id.title)
        );

        // Check for modified cities
        this.importedModifiedCities = this.importedCities
        .filter((city: City) => 
          !!this.cities.find(item => item.title === city.title && item.locations_id.title === city.locations_id.title)
        )
        .filter((city: City) => {
          // Check if sector has been modified
          const currentSubsector = this.cities.find(item => item.title === city.title);
          return this.normalizeStringToCompare(currentSubsector!.link) !== this.normalizeStringToCompare(city.link) || 
                 this.normalizeStringToCompare(currentSubsector!.locations_id.title) !== this.normalizeStringToCompare(city.locations_id.title) || 
                 this.normalizeStringToCompare(currentSubsector!.h1) !== this.normalizeStringToCompare(city.h1) ||
                 this.normalizeStringToCompare(currentSubsector!.meta_description) !== this.normalizeStringToCompare(city.meta_description) ||
                 this.normalizeStringToCompare(currentSubsector!.page_title) !== this.normalizeStringToCompare(city.page_title)
        });

        // Check for deleted cities
        this.importedDeletedCities = this.cities.filter((city: City) => 
          !this.importedCities.find(item => item.title === city.title && item.locations_id.title === city.locations_id.title)
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

    try {
      await this.keywordService.addCityKeyword({
        location: this.currentCity!.locations_id.id, 
        title: this.currentCity!.title,
        link: this.currentCity?.link || this.generateLink(this.currentCity!.title, 'servicios-profesionales-en'),
        h1: this.currentCity?.h1 || this.generateH1(this.currentCity!.title),
        pagetitle: this.currentCity?.page_title || this.generatePageTitle(this.currentCity!.title),
        metadescription: this.currentCity?.meta_description || this.generateMetaDescription(this.currentCity!.title)
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentCity = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.keywordService.removeCityKeyword(this.currentCity!.id);

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentCity = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let city of this.selected ) {
        await this.keywordService.removeCityKeyword(city.id);
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

    try {
      await this.keywordService.updateCityKeyword({
        city: this.currentCity!.id,
        location: this.currentCity!.locations_id.id, 
        title: this.currentCity!.title,  
        link: this.currentCity!.link || this.generateLink(this.currentCity!.title, 'servicios-profesionales-en'),
        h1: this.currentCity!.h1 || this.generateH1(this.currentCity!.title),
        pagetitle: this.currentCity!.page_title || this.generatePageTitle(this.currentCity!.title),
        metadescription: this.currentCity!.meta_description || this.generateMetaDescription(this.currentCity!.title)
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentCity = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new cities
    for ( let city of this.importedNewCities ) {
      await this.keywordService.addCityKeyword({
        location: this.provinces.find(item => item.title === city.locations_id.title)!.id,
        title: city.title,
        link: city.link || this.generateLink(city.title, 'servicios-profesionales-en'),
        h1: city.h1 || this.generateH1(city.title),
        pagetitle: city.page_title || this.generatePageTitle(city.title),
        metadescription: city.meta_description || this.generateMetaDescription(city.title)
      });
    }

    // Update modified cities
    for ( let city of this.importedModifiedCities ) {
      await this.keywordService.updateCityKeyword({
        city: this.cities.find(item => item.title === city.title && item.locations_id.title === city.locations_id.title)!.id,
        location: this.provinces.find(item => item.title === city.locations_id.title)!.id, 
        title: city.title,
        link: city.link || this.generateLink(city.title, 'servicios-profesionales-en'),
        h1: city.h1 || this.generateH1(city.title),
        pagetitle: city.page_title || this.generatePageTitle(city.title),
        metadescription: city.meta_description || this.generateMetaDescription(city.title)
      });
    }
    
    // Delete deleted cities
    for ( let city of this.importedDeletedCities ) {
      await this.keywordService.removeCityKeyword(city.id);
    }

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }

  generateH1(string: string | undefined): string {
    if (!string) return '';
    return `Ofertas de servicios profesionales en ${string}`;
  }
  generatePageTitle(string: string | undefined): string {
    if (!string) return '';
    return `Ofertas de servicios profesionales en ${string}`;
  }
  generateMetaDescription(string: string | undefined): string {
    if (!string) return '';
    return `Servicios profesionales en ${string}. Si necesitas servicios de asesoría, reformas, belleza, salud o formación, hay una solución para ti en Febelink`;
  }
}
