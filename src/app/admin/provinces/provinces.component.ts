import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { Location as LegacyLocation } from '../../interfaces/location';
import { City as LegacyCity } from '../../interfaces/city';
import { LinkLocation } from '../../interfaces/link-location';

interface City extends LegacyCity {
  removed?: boolean;
}
interface Location extends LegacyLocation {
  selected?: boolean;
  isNew?: boolean;
  cities?: City[];
  citiesInput?: string;
}

@Component({
  selector: 'app-provinces',
  templateUrl: './provinces.component.html'
})
export class ProvincesComponent extends BaseComponent implements OnInit {

  @ViewChild('citiesModal') citiesModal: any;

  generatedLinks: LinkLocation[] = [];
  provinces: Location[] = [];
  filteredProvinces: Location[] = [];
  importedProvinces: Location[] = [];
  importedNewProvinces: Location[] = [];
  importedModifiedProvinces: Location[] = [];
  importedDeletedProvinces: Location[] = [];
  cities: City[] = [];

  currentProvince: Location | undefined = undefined;

  queryProvince: string | undefined = undefined;

  loadingLinks: boolean = false;

  get someSelected(): boolean {
    return this.filteredProvinces.some(item => item.selected);
  }

  get selected(): Location[] {
    return this.filteredProvinces.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentProvince?.isNew && !!this.currentProvince?.title;
  }

  get canUpdate(): boolean {
    return !this.currentProvince?.isNew && !!this.currentProvince?.title;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef
  ) {
    super();

    this.route.queryParams.subscribe(params => {
      this.queryProvince = params['province'];
    });
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.keywordService.getLocationKeywords()
    .then((data: any) => {
      this.provinces = data.response;
      this.filter({ target: { value: this.currentFilter } });

      this.getCities().then(data2 => {
        this.provinces.forEach((province: Location) => {
          province.cities = data2.response.filter((item: City) => item.locations_id.id === province.id)
        })

        this.loading = false;
        this.cdRef.detectChanges();
      }).catch((error) => {
        this.loading = false;
        this.cdRef.detectChanges();
      })

      if ( this.queryProvince ) {
        this.currentProvince = this.provinces.find(item => item.id === Number(this.queryProvince));
        this.showEditModal();
      }
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });

    this.loadingLinks = true;
    this.keywordService.getLinkLocationKeywords()
    .then((data: any) => {
      this.generatedLinks = data.response;
      this.loadingLinks = false;
      this.cdRef.detectChanges();
    })
  }

  getCities() {
    return this.keywordService.getCityKeywords()
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
    this.filteredProvinces = this.provinces.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentProvince = {
      id: 0,
      h1: '',
      link: '',
      meta_description: '',
      page_title: '',
      title: '',
      updated_at: '',
      checked: false,
      isNew: true,
      citiesInput: ''
    };
    this.showCreateModal();
  }
  showCities(event: any, item: Location) {
    event.stopPropagation();
    this.currentProvince = item;
    this.citiesModal.nativeElement.showModal();
  }
  showEdit(event: any, item: Location) {
    event.stopPropagation();
    this.currentProvince = JSON.parse(JSON.stringify(item));
    this.showEditModal();
  }
  showDelete(event: any, item: Location) {
    event.stopPropagation();
    this.currentProvince = item;
    this.showDeleteModal();
  }

  viewLink(event: any, link: string) {
    event.stopPropagation();
    const url = this.router.serializeUrl(this.router.createUrlTree([`listado/${link}`], {}));
    window.open(url, '_blank');
  }

  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Provincia;Enlace;H1;Meta descripción;Título de página;Ciudades\n';

    // Add data
    const provincesCsv = this.filteredProvinces.map(item => {
      return `${item.title};${item.link};${item.h1};${item.meta_description};${item.page_title};${item.cities?.map(city => city.title).join(',')}`;
    })

    // Add data to csv
    csvContent += provincesCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "provincias.csv");
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
        const provinces = lines.map((line: string) => {
          const [title, link, h1, meta_description, page_title, cities] = line.split(';');
          return { title, link, h1, meta_description, page_title, cities };
        });

        // Parse data
        this.importedProvinces = provinces.map((province: { title: string, link: string, h1: string, meta_description: string, page_title: string, cities: string }) => {
          return {
            title: province.title,
            link: province.link,
            h1: province.h1,
            meta_description: province.meta_description,
            page_title: province.page_title,
            cities: province.cities ? province.cities.split(',').map((key: string) => ({ title: key })) : [],
          }
        })

        // Check for new provinces
        this.importedNewProvinces = this.importedProvinces.filter((province: Location) => 
          !this.provinces.find(item => item.title === province.title)
        );

        // Check for modified provinces
        this.importedModifiedProvinces = this.importedProvinces
        .filter((province: Location) => 
          !!this.provinces.find(item => item.title === province.title)
        )
        .filter((province: Location) => {
          // Check if province has been modified
          const currentProvince = this.provinces.find(item => item.title === province.title);
          return this.normalizeStringToCompare(currentProvince!.link) !== this.normalizeStringToCompare(province.link) || 
                 this.normalizeStringToCompare(currentProvince!.h1) !== this.normalizeStringToCompare(province.h1) ||
                 this.normalizeStringToCompare(currentProvince!.meta_description) !== this.normalizeStringToCompare(province.meta_description) ||
                 this.normalizeStringToCompare(currentProvince!.page_title) !== this.normalizeStringToCompare(province.page_title) ||
                 currentProvince!.cities?.map(key => key.title).join(',') !== province.cities?.map(key => key.title).join(',');
        });

        // Check for deleted provinces
        this.importedDeletedProvinces = this.provinces.filter((province: Location) => 
          !this.importedProvinces.find(item => item.title === province.title)
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

    const cities = this.currentProvince?.citiesInput ? this.currentProvince?.citiesInput?.split(',').map(city => city.trim()) : [];

    try {
      const data = await this.keywordService.addLocationKeyword({
        title: this.currentProvince!.title, 
        link: this.currentProvince?.link || this.generateLink(this.currentProvince!.title, 'servicios-profesionales-en'), 
        h1: this.currentProvince?.h1 || this.generateH1(this.currentProvince!.title),
        pagetitle: this.currentProvince?.page_title || this.generatePageTitle(this.currentProvince!.title), 
        metadescription: this.currentProvince?.meta_description || this.generateMetaDescription(this.currentProvince!.title)
      });

      for ( let city of cities ) {
        await this.createCity(data.response.id, city);
      }

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentProvince = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async createCity(provinceId: number, city: string) {
    await this.keywordService.addCityKeyword({
      location: provinceId, 
      title: city,
      link: this.generateLink(city, 'servicios-profesionales-en'),
      h1: this.generateH1City(city),
      pagetitle: this.generatePageTitleCity(city),
      metadescription: this.generateMetaDescriptionCity(city)
    });
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.keywordService.removeLocationKeyword(this.currentProvince!.id);

      for ( let city of this.currentProvince!.cities! ) {
        await this.deleteCity(city.id);
      }

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentProvince = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteCity(cityId: number) {
    await this.keywordService.removeCityKeyword(cityId);
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let province of this.selected ) {
        await this.keywordService.removeLocationKeyword(province.id);
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

    const cities = this.currentProvince?.citiesInput ? this.currentProvince?.citiesInput?.split(',').map(city => city.trim()) : [];

    try {
      await this.keywordService.updateLocationKeyword({
        locations: this.currentProvince!.id, 
        title: this.currentProvince!.title,
        link: this.currentProvince?.link || this.generateLink(this.currentProvince!.title, 'servicios-profesionales-en'), 
        h1: this.currentProvince?.h1 || this.generateH1(this.currentProvince!.title), 
        pagetitle: this.currentProvince?.page_title || this.generatePageTitle(this.currentProvince!.title), 
        metadescription: this.currentProvince?.meta_description || this.generateMetaDescription(this.currentProvince!.title)
      });

      for ( let city of cities ) {
        await this.createCity(this.currentProvince!.id, city);
      }

      for ( let city of this.currentProvince!.cities!.filter(city => city.removed) ) {
        await this.deleteCity(city.id);
      }

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentProvince = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new provinces
    for( let province of this.importedNewProvinces ) {
      const data = await this.keywordService.addLocationKeyword({
        title: province.title, 
        link: province.link || this.generateLink(province.title, 'servicios-profesionales-en'),
        h1: province.h1 || this.generateH1(province.title), 
        pagetitle: province.page_title || this.generatePageTitle(province.title), 
        metadescription: province.meta_description || this.generateMetaDescription(province.title)
      });

      for ( let city of province.cities! ) {
        await this.createCity(data.response.id, city.title);
      }
    }

    // Update modified provinces
    for(let province of this.importedModifiedProvinces) {
      await this.keywordService.updateLocationKeyword({
        locations: this.provinces.find(item => item.title === province.title)!.id, 
        title: province!.title,
        link: province?.link || this.generateLink(province!.title, 'servicios-profesionales-en'), 
        h1: province?.h1 || this.generateH1(province!.title), 
        pagetitle: province?.page_title || this.generatePageTitle(province!.title), 
        metadescription: province?.meta_description || this.generateMetaDescription(province!.title)
      });

      // Get new cities
      const newCities = province.cities!.filter(city => !this.provinces.find(item => item.title === province.title)!.cities!.map(city => city.title).includes(city.title));
      // Get deleted cities
      const deletedCities = this.provinces.find(item => item.title === province.title)!.cities!.filter(city => !province.cities!.map(city => city.title).includes(city.title));

      for(let city of newCities) {
        await this.createCity(this.provinces.find(item => item.title === province.title)!.id, city.title);
      }

      for(let city of deletedCities) {
        await this.deleteCity(city.id);
      }
    };

    // Delete deleted provinces
    for(let province of this.importedDeletedProvinces) {
      await this.keywordService.removeLocationKeyword(province.id);

      for ( let city of province.cities! ) {
        await this.deleteCity(city.id);
      }
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

  generateH1City(string: string | undefined): string {
    if (!string) return '';
    return `Ofertas de servicios profesionales en ${string}`;
  }
  generatePageTitleCity(string: string | undefined): string {
    if (!string) return '';
    return `Ofertas de servicios profesionales en ${string}`;
  }
  generateMetaDescriptionCity(string: string | undefined): string {
    if (!string) return '';
    return `Servicios profesionales en ${string}. Si necesitas servicios de asesoría, reformas, belleza, salud o formación, hay una solución para ti en Febelink`;
  }
}
