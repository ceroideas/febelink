import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { ShadowUsersService } from '../../services/shadow-users.service';

import { Subsector } from '../../interfaces/subsector';
import { Location as LegacyLocation } from '../../interfaces/location';
import { City } from '../../interfaces/city';

interface Location extends LegacyLocation {
  removed?: boolean;
}

export interface OwnUser {
  id?: number;
  nick: string;
  descripcion?: string;
  phone?: string;
  email: string;
  location: {locationId: number, location: string, city: string, removed?: boolean}[];
  profession: {subSectorId: number, subSectorName: string, removed?: boolean}[];
  selected?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-shadow-users',
  templateUrl: './shadow-users.component.html'
})
export class ShadowUsersComponent extends BaseComponent implements OnInit {

  @ViewChild('keywordsModal') keywordsModal: any;
  @ViewChild('subsectorsModal') subsectorsModal: any;

  provinces: Location[] = [];
  cities: City[] = [];
  subsectors: Subsector[] = [];
  ownUsers: OwnUser[] = [];
  filteredOwnUsers: OwnUser[] = [];
  importedOwnUsers: OwnUser[] = [];
  importedNewOwnUsers: OwnUser[] = [];
  importedModifiedOwnUsers: OwnUser[] = [];
  importedDeletedOwnUsers: OwnUser[] = [];

  currentOwnUser: OwnUser | undefined = undefined;

  selectedSubsectorId: number = 0;
  selectedCityId: number | undefined = undefined;
  insertedCity: string = '';

  get someSelected(): boolean {
    return this.filteredOwnUsers.some(item => item.selected);
  }

  get selected(): OwnUser[] {
    return this.filteredOwnUsers.filter(item => item.selected);
  }

  get canCreate(): boolean {
    return !!this.currentOwnUser?.isNew && !!this.currentOwnUser?.nick && !!this.currentOwnUser?.location.length && !!this.currentOwnUser?.profession.length;
  }

  get canUpdate(): boolean {
    return !this.currentOwnUser?.isNew && !!this.currentOwnUser?.nick && !!this.currentOwnUser?.location.length && !!this.currentOwnUser?.profession.length;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef,
    private shadowUsersService: ShadowUsersService
  ) { 
    super();
  }

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.loading = false;
    this.shadowUsersService.get().then((data: any) => {
      this.ownUsers = data.response;
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

    this.keywordService.getCityKeywords()
    .then((data: any) => {
      this.cities = data.response.sort((a: City, b: City) => a.locations_id.title.localeCompare(b.locations_id.title));

      this.loading = false;
      this.cdRef.detectChanges();
    })

    this.keywordService.getSubSectorAll()
    .then((data: any) => {
      this.subsectors = data.response;
      this.cdRef.detectChanges();
    })
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredOwnUsers = this.ownUsers.filter(item => item.nick.toLowerCase().includes(value.toLowerCase()));
  }

  showCreate() {
    this.currentOwnUser = {
      id: 0,
      nick: '',
      descripcion: '',
      phone: '',
      email: '',
      location: [],
      profession: [],
      isNew: true,
    };
    this.showCreateModal();
  }
  showKeywords(event: any, item: OwnUser) {
    event.stopPropagation();
    this.currentOwnUser = item;
    this.keywordsModal.nativeElement.showModal();
  }
  showSubsectors(event: any, item: OwnUser) {
    event.stopPropagation();
    this.currentOwnUser = item;
    this.subsectorsModal.nativeElement.showModal();
  }
  showEdit(event: any, item: OwnUser) {
    event.stopPropagation();
    this.currentOwnUser = JSON.parse(JSON.stringify(item));
    this.showEditModal();
  }
  showDelete(event: any, item: OwnUser) {
    event.stopPropagation();
    this.currentOwnUser = item;
    this.showDeleteModal();
  }

  addSubsector() {
    const subsector = this.subsectors.find(subsector => subsector.id === Number(this.selectedSubsectorId));
    if ( subsector ) {
      this.currentOwnUser?.profession.push({ subSectorId: subsector.id, subSectorName: subsector.nombre });
    }

    setTimeout(() => {
      this.selectedSubsectorId = 0;
      this.cdRef.detectChanges();
    });
  }
  addLocation() {
    const city = this.cities.find(city => city.id === Number(this.selectedCityId));

    if ( city ) {
      const location = this.provinces.find(location => location.id === city?.locations_id.id);
      
      if ( location ) {
        this.currentOwnUser?.location.push(
          { locationId: location.id, location: location.title, city: city.title }
        );
      }
    }

    setTimeout(() => {
      this.selectedCityId = undefined;
      this.cdRef.detectChanges();
    });
  }

  stringifyProfessions(user: OwnUser) {
    return user.profession.map(item => item.subSectorName).join(', ');
  }
  stringifyLocations(user: OwnUser) {
    return user.location.map(item => item.location + ' - ' + item.city).join(', ');
  }
  
  export() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += 'Nombre;Descripción;Teléfono;Email;Profesiones;Ubicaciones\n';

    // Add data
    const itemsCsv = this.filteredOwnUsers.map(item => {
      return `${item.nick};${item.descripcion};${item.phone};${item.email};${item.profession.map(subitem => subitem.subSectorName).join(',')};${item.location.map(subitem => subitem.city).join(',')}`;
    })

    // Add data to csv
    csvContent += itemsCsv.join('\n');

    // Download csv
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios_propios.csv");
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
        const items = lines.map((line: string) => {
          const [nick, descripcion, phone, email, professions, locations] = line.split(';');
          return { nick, descripcion, phone, email, professions, locations };
        });

        // Parse data
        this.importedOwnUsers = items.map((
          item: { nick: string, descripcion: string, phone: string, email: string, professions: string, locations: string }
        ) => {
          const cities = this.cities.filter(city => item.locations.split(',').includes(city.title));
          const subsectors = this.subsectors.filter(subsector => item.professions.split(',').includes(subsector.nombre));

          return {
            id: 0,
            nick: item.nick,
            descripcion: item.descripcion,
            phone: item.phone,
            email: item.email,
            location: cities.map(city => { return { locationId: city.locations_id.id, location: city.locations_id.title, city: city.title } }),
            profession: subsectors.map(subsector => { return { subSectorId: subsector.id, subSectorName: subsector.nombre } }),
          }
        })

        // Check for new own product
        this.importedNewOwnUsers = this.importedOwnUsers.filter((item: OwnUser) => 
          !this.ownUsers.find(subitem => subitem.email === item.email)
        );

        // Check for modified own product
        this.importedModifiedOwnUsers = this.importedOwnUsers
        .filter((item: OwnUser) => 
          !!this.ownUsers.find(subitem => subitem.email === item.email)
        )
        .filter((item: OwnUser) => {
          // Check if data has been modified
          const currentOwnUser = this.ownUsers.find(subitem => subitem.email === item.email);
          return currentOwnUser!.nick !== item.nick || 
                 currentOwnUser!.phone !== item.phone || 
                 currentOwnUser!.descripcion !== item.descripcion || 
                 currentOwnUser!.profession.map(item => item.subSectorId).sort().join(',') !== item.profession.map(item => item.subSectorId).sort().join(',') ||
                 currentOwnUser!.location.map(item => item.locationId).sort().join(',') !== item.location.map(item => item.locationId).sort().join(',')
        });

        // Check for deleted own product
        this.importedDeletedOwnUsers = this.ownUsers.filter((item: OwnUser) => 
          !this.importedOwnUsers.find(subitem => subitem.email === item.email)
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
      await this.shadowUsersService.create({
        nick: this.currentOwnUser?.nick,
        description: this.currentOwnUser?.descripcion,
        phone: this.currentOwnUser?.phone,
        email: this.currentOwnUser?.email,
        locations: this.currentOwnUser?.location,
        professions: this.currentOwnUser?.profession.map(item => {
          return {
            id: item.subSectorId,
            name: item.subSectorName,
          }
        }),
      })

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentOwnUser = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async delete() {
    this.loadingRequest = true;

    try {
      await this.shadowUsersService.delete(this.currentOwnUser!.id!);

      this.getData(true);

      this.loadingRequest = false;
      this.deleteModal.nativeElement.close();
      this.currentOwnUser = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async deleteMultiple() {
    this.loadingRequest = true;

    try {
      for ( let item of this.selected ) {
        await this.shadowUsersService.delete(item.id!);
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
      // Update sector
      await this.shadowUsersService.update({
        id: this.currentOwnUser?.id,
        nick: this.currentOwnUser?.nick,
        description: this.currentOwnUser?.descripcion,
        phone: this.currentOwnUser?.phone,
        email: this.currentOwnUser?.email,
        locations: JSON.stringify(this.currentOwnUser?.location.filter(item => !item.removed)),
        professions: JSON.stringify(this.currentOwnUser?.profession.filter(item => !item.removed).map(item => {
          return {
            id: item.subSectorId,
            name: item.subSectorName,
          }
        })),
      });

      this.getData(true);

      this.loadingRequest = false;
      this.editModal.nativeElement.close();
      this.currentOwnUser = undefined;
    } catch (error) {
      this.loadingRequest = false;
    }
  }
  async applyImport() {
    this.loadingRequest = true;

    // Create new own product
    for(let item of this.importedNewOwnUsers) {
      await this.shadowUsersService.create({
        nick: item?.nick,
        description: item?.descripcion,
        phone: item?.phone,
        email: item?.email,
        locations: item?.location,
        professions: item?.profession.map(item => {
          return {
            id: item.subSectorId,
            name: item.subSectorName,
          }
        }),
      });
    };

    // Update modified own product
    for(let item of this.importedModifiedOwnUsers) {
      await this.shadowUsersService.update({
        id: this.ownUsers.find(subitem => subitem.email === item.email)?.id,
        nick: item?.nick,
        description: item?.descripcion,
        phone: item?.phone,
        email: item?.email,
        locations: JSON.stringify(item?.location),
        professions: JSON.stringify(item?.profession.map(item => {
          return {
            id: item.subSectorId,
            name: item.subSectorName,
          }
        })),
      });
    };

    // Delete deleted own product
    for(let item of this.importedDeletedOwnUsers) {
      await this.shadowUsersService.delete(this.ownUsers.find(subitem => subitem.email === item.email)?.id!);
    };

    this.getData(true);

    this.loadingRequest = false;
    this.closeImportSummaryModal()
  }
}
