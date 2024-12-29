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
      this.filter({ target: { value: this.currentFilter } });

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
    // let csvContent = "data:text/csv;charset=utf-8,";

    // // Add header
    // csvContent += 'Título;Descripcion;Profesión;Provincia;Ciudad\n';

    // // Add data
    // const itemsCsv = this.filteredOwnUsers.map(item => {
    //   return `${item.title};${item.descripcion};${item.subsector};${item.location};${item.city}`;
    // })

    // // Add data to csv
    // csvContent += itemsCsv.join('\n');

    // // Download csv
    // const encodedUri = encodeURI(csvContent);
    // const link = document.createElement("a");
    // link.setAttribute("href", encodedUri);
    // link.setAttribute("download", "servicios_propios.csv");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  }
  import() {
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.accept = '.csv';
    // input.onchange = (event: any) => {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     const csv = e.target.result;
    //     const lines = csv.split('\n');
    //     lines.shift(); // Remove header
    //     const items = lines.map((line: string) => {
    //       const [descripcion, subsector, location] = line.split(';');
    //       return { descripcion, subsector, location };
    //     });

    //     // Parse data
    //     this.importedOwnUsers = items.map((
    //       item: { title: string, descripcion: string, subsector: string, location: string, city: string }
    //     ) => {
    //       return {
    //         title: item.title,
    //         descripcion: item.descripcion,
    //         subsector: item.subsector,
    //         location: item.location,
    //         location_id: this.provinces.find(province => province.title === item.location)?.id || 0,
    //         subsector_id: this.subsectors.find(subsector => subsector.nombre === item.subsector)?.id || 0,
    //         city: item.city,
    //       }
    //     })

    //     // Check for new own product
    //     this.importedNewOwnUsers = this.importedOwnUsers.filter((item: OwnUser) => 
    //       !this.ownUsers.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city)
    //     );

    //     // Check for modified own product
    //     this.importedModifiedOwnUsers = this.importedOwnUsers
    //     .filter((item: OwnUser) => 
    //       !!this.ownUsers.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city)
    //     )
    //     .filter((item: OwnUser) => {
    //       // Check if sector has been modified
    //       const currentOwnUser = this.ownUsers.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city);
    //       return currentOwnUser!.title !== item.title || 
    //              currentOwnUser!.descripcion !== item.descripcion
    //     });

    //     // Check for deleted own product
    //     this.importedDeletedOwnUsers = this.ownUsers.filter((item: OwnUser) => 
    //       !this.importedOwnUsers.find(subitem => subitem.location === item.location && subitem.subsector === item.subsector && subitem.city === item.city)
    //     );

    //     this.importSummaryModal.nativeElement.showModal();
    //   }
    //   reader.readAsText(file);
    // }
    // document.body.appendChild(input);
    // input.click();
    // document.body.removeChild(input);
  }

  async create() {
    this.loadingRequest = true;

    try {
      await this.shadowUsersService.create({
        nick: this.currentOwnUser?.nick,
        descripcion: this.currentOwnUser?.descripcion,
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
        descripcion: this.currentOwnUser?.descripcion,
        locations: this.currentOwnUser?.location,
        professions: this.currentOwnUser?.profession.map(item => {
          return {
            id: item.subSectorId,
            name: item.subSectorName,
          }
        }),
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
    // this.loadingRequest = true;

    // // Create new own product
    // for(let item of this.importedNewOwnUsers) {
    //   await this.searchForYouService.create({
    //     location: item?.location_id.toString(),
    //     subsector: item?.subsector_id.toString(),
    //     descripcion: item!.descripcion,
    //   });
    // };

    // // Update modified own product
    // for(let item of this.importedModifiedOwnUsers) {
    //   await this.searchForYouService.update({
    //     location: item?.location_id.toString(),
    //     subsector: item?.subsector_id.toString(),
    //     descripcion: item!.descripcion,
    //   });
    // };

    // // Delete deleted own product
    // for(let item of this.importedDeletedOwnUsers) {
    //   await this.searchForYouService.delete(item.id!);
    // };

    // this.getData(true);

    // this.loadingRequest = false;
    // this.closeImportSummaryModal()
  }
}
